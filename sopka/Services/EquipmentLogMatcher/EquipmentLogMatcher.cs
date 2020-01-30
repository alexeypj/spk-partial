using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using JobServer.Collections;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.EquipmentLogs;
using sopka.Models.EquipmentLogs.Rules;
using sopka.Models.ViewModels;
using sopka.Services.Email;
using sopka.Services.EquipmentLogMatcher.RuleMatcher;

namespace sopka.Services.EquipmentLogMatcher
{
    public class EquipmentLogMatcher : BackgroundService
    {
        private List<RuleMatcherBase> _rules;
        private readonly int _concurrencyLevel;
        private readonly int _actionsConcurrencyLevel;
        private readonly ILogger<EquipmentLogMatcher> _logger;
        private readonly IServiceProvider _services;
        private readonly EquipmentLogDataBus _dataBus;
        private List<Thread> _threads;
        private List<Thread> _actionThreads;
        private readonly BlockingCollection<LogMatcherSubtask> _tasks;
        private readonly BlockingCollection<RuleAction> _actionTasks;
        private readonly object _locker = new object();
        public const int Timeout = 200;

        public EquipmentLogMatcher(EquipmentLogDataBus dataBus, ConcurrencyLevel concurrencyLevel, IServiceProvider services, ILogger<EquipmentLogMatcher> logger)
        {
            _services = services;
            _logger = logger;
            _dataBus = dataBus;
            _concurrencyLevel = concurrencyLevel.Threads;
            _actionsConcurrencyLevel = _concurrencyLevel / 2; // количество потоков обработки действий
            _rules = new List<RuleMatcherBase>();
            _tasks = new BlockingCollection<LogMatcherSubtask>();
            _actionTasks = new BlockingCollection<RuleAction>();
            
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"{nameof(EquipmentLogMatcher)} started");
            return base.StartAsync(cancellationToken);
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            await base.StopAsync(cancellationToken);
            await StoreState();
            _logger.LogInformation($"{nameof(EquipmentLogMatcher)} stopped");
        }

        /// <summary>
        /// Выполняемая задача Background сервиса
        /// </summary>
        /// <param name="token">Токен отмены</param>
        /// <returns></returns>
        protected override async Task ExecuteAsync(CancellationToken token)
        {
            // Инициализация
            try
            {
                InitWorkers(token);
                await InitRules();
                InitActionWorkers(token);
                
            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Initialization failed: {ex.Message}");
                throw;
            }

            // Рабочий алгоритм
            while (!token.IsCancellationRequested)
            {
                try
                {
                    RenewRules();
                    if (_dataBus.LogQueue.TryTake(out var packet, Timeout, token))
                        Handle(packet);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message, ex.InnerException);
                }
            }
        }

        private void InitWorkers(CancellationToken token)
        {
            _threads = Enumerable.Range(1, _concurrencyLevel).Select(i => new Thread(Run)).ToList();
            _threads.ForEach(t => t.Start(token));
        }

        private async Task InitRules()
        {
            var loadedRules = await LoadRules();
            _rules = new List<RuleMatcherBase>(loadedRules.Count);
            foreach (var rule in loadedRules)
            {
                try
                {
                    _rules.Add(CreateRule(rule));
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Rule initialization failed: {ex.Message} Id = {rule.Id}");
                }
            }
            await RestoreState();
        }

        protected virtual void InitActionWorkers(CancellationToken token)
        {
            EmailService emailService;
            IncidentService incidentService;

            using (var scope = _services.CreateScope())
            {
                emailService = scope.ServiceProvider.GetRequiredService<EmailService>();
                incidentService = scope.ServiceProvider.GetService<IncidentService>();
            }

            _actionThreads = Enumerable.Range(1, _actionsConcurrencyLevel).Select(i => new Thread(WorkerActions)).ToList();
            _actionThreads.ForEach(t => t.Start(new Tuple<CancellationToken, EmailService, IncidentService>(token, emailService, incidentService)));
        }

        /// <summary>
        /// Обработка пакета логов
        /// </summary>
        /// <param name="logs">Пакет логов</param>
        private void Handle(List<EquipmentLog> logs)
        {
            if (logs != null && logs.Any())
            {
                _logger.LogInformation($"Processing {logs.Count} logs with {_concurrencyLevel} threads");
                var splitter = new CollectionSplitter<RuleMatcherBase>(_rules, (int)Math.Ceiling((double)_rules.Count / _concurrencyLevel));
                foreach (var rules in splitter)
                {
                    _tasks.Add(new LogMatcherSubtask()
                    {
                        Logs = logs,
                        Rules = rules
                    });
                }
            }
        }

        /// <summary>
        /// Основной метод-потребитель пула потоков
        /// </summary>
        private void Run(object token)
        {
            var cancellationToken = (CancellationToken) token;
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    if (_tasks.TryTake(out var task, Timeout, cancellationToken))
                    {
                        if (task.Rules != null && task.Rules.Any())
                        {
                            foreach (var rule in task.Rules)
                            {
                                Worker(rule, task.Logs);
                            }
                        }
                    }
                    if (cancellationToken.IsCancellationRequested) break;
                }
                catch (Exception ex)
                {
                    lock (_locker)
                    {
                        _logger.LogError(ex.Message, ex);
                    }
                }
            }
        }

        /// <summary>
        /// Обработка логов правилом
        /// </summary>
        /// <param name="rule">Правило</param>
        /// <param name="logs">Набор логов</param>
        private void Worker(RuleMatcherBase rule, List<EquipmentLog> logs)
        {
            rule.ClearOutdated();
            foreach (var log in logs)
            {
                rule.Process(log);
                if (rule.IsTriggered())
                {
                    _actionTasks.Add(rule.CreateAction());
                    rule.Reset();
                }
            }
        }

        /// <summary>
        /// Загрузка правил из базы
        /// </summary>
        /// <returns></returns>
        protected virtual async Task<List<Rule>> LoadRules()
        {
            using (var scope = _services.CreateScope())
            {
                using (var dbContext = scope.ServiceProvider.GetRequiredService<SopkaDbContext>())
                {
                    return await dbContext
                        .EquipmentLogRules.Include(x => x.Conditions)
                        .AsNoTracking()
                        .ToListAsync();
                }
            }
        }

        /// <summary>
        /// Обновление действующих правил
        /// </summary>
        private void RenewRules()
        {
            if(_dataBus.Rules.TryTake(out var rule))
            {
                if (rule != null)
                {
                    var existingRule = _rules.FirstOrDefault(x => x.Id == rule.Id);
                    if (existingRule == null)
                    {
                        if (rule.IsActive)
                        {
                            _rules.Add(CreateRule(rule));
                        }
                    }
                    else
                    {
                        // обновление TODO Сохранение состояния?
                        var idx = _rules.IndexOf(existingRule);
                        if (rule.IsActive)
                        {
                            _rules[idx] = CreateRule(rule);
                        }
                        else
                        {
                            _rules.RemoveAt(idx);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Создание обработчика правила на основе правила
        /// </summary>
        /// <param name="rule">Исходное правило</param>
        /// <returns></returns>
        private RuleMatcherBase CreateRule(Rule rule)
        {
            switch (rule.OnCondition)
            {
                case Rule.ConditionType.One: return new AtLeastOneMatcher(rule);
                case Rule.ConditionType.All: return new AllMatcher(rule);
                case Rule.ConditionType.AllInParticularOrder: return new AllInParticularOrder(rule);
                default: throw new Exception("Unknown rule condition type");
            }
        }

        /// <summary>
        ///  Сохранение текущего состояния правил в базу 
        /// </summary>
        /// <returns></returns>
        private async Task StoreState()
        {
            using (var scope = _services.CreateScope())
            {
                using (var dbContext = scope.ServiceProvider.GetRequiredService<SopkaDbContext>())
                {
                    foreach (var rule in _rules)
                    {
                        foreach (var state in rule.GetState())
                        {
                            if (dbContext.EquipmentLogRuleStates.Any(x => x.ConditionId == state.ConditionId))
                            {
                                dbContext.Entry(state).State = EntityState.Modified;
                            }
                            else
                            {
                                dbContext.Entry(state).State = EntityState.Added;
                            }
                        }
                    }
                    await dbContext.SaveChangesAsync();
                }
            }
        }

        /// <summary>
        /// Восстановление состояния правил из базы
        /// </summary>
        /// <returns></returns>
        protected virtual async Task RestoreState()
        {
            using (var scope = _services.CreateScope())
            {
                using (var dbContext = scope.ServiceProvider.GetRequiredService<SopkaDbContext>())
                {
                    var states = await dbContext
                        .EquipmentLogRuleStates
                        .AsNoTracking()
                        .ToDictionaryAsync(x => x.ConditionId, x => x);

                    foreach (var rule in _rules)
                    {
                        var ids = rule.ConditionIds().ToList();
                        rule.RestoreState(states.Where(x => ids.Contains(x.Key)).Select(x => x.Value));
                    }
                }
            }
        }

        #region Обработка действий

        protected void WorkerActions(object data)
        {
            var (token, emailService, incidentService) = (Tuple<CancellationToken, EmailService, IncidentService>) data;
            while (!token.IsCancellationRequested)
            {
                if (_actionTasks.TryTake(out var action, Timeout))
                {
                    switch (action.Action)
                    {
                        case Rule.ActionType.CreateIncident:
                            Task.WaitAll(CreateIncident(action, incidentService));
                            break;
                        case Rule.ActionType.SendEmail:
                            Task.WaitAll(SendEmail(action, emailService));
                            break;
                    }
                }
            }
        }

        private Task CreateIncident(RuleAction action, IncidentService incidentService)
        {
            return incidentService.Create(new IncidentModel()
            {
                Title = action.Title,
                Description = FormatBody(action),
                FixationTime = DateTimeOffset.Now,
                CreateDate = DateTimeOffset.Now
            }, null);
        }

        private Task SendEmail(RuleAction action, EmailService emailService)
        {
            return emailService.Send(action.EmailAddress, action.Title, FormatBody(action));
        }

        private string FormatBody(RuleAction action)
        {
            var builder = new StringBuilder();
            builder.Append(action.Description);
            builder.AppendLine("\nЛоги, которые привели к срабатыванию правила:");
            int num = 1;
            foreach (var state in action.State)
            {
                builder.AppendLine($"Условие №{num++}");
                foreach (var id in state.LogIds)
                {
                    builder.AppendLine(id.ToString());
                }
                builder.AppendLine(string.Empty);
            }
            return builder.ToString();
        }

        #endregion
    }
}
