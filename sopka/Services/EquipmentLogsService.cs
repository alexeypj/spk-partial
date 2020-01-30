using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.EquipmentLogs.Rules;
using sopka.Models.Filters;
using sopka.Services.EquipmentLogMatcher;
using Rule = sopka.Models.EquipmentLogs.Rules.Rule;

namespace sopka.Services
{
    public class EquipmentLogsService
    {
        private readonly SopkaDbContext _dbContext;
        private readonly string _connectionString;
        private EquipmentLogDataBus _dataBus;
        private readonly AccessControlService _accessControlService;
        private readonly CurrentUser _currentUser;

        public EquipmentLogsService(EquipmentLogDataBus dataBus, SopkaDbContext context, AccessControlService accessControlService, CurrentUser currentUser)
        {
            _dbContext = context;
            _accessControlService = accessControlService;
            _currentUser = currentUser;
            _connectionString = _dbContext.Database.GetDbConnection().ConnectionString;
            _dataBus = dataBus;
        }

        public async Task<PaginationModel<Rule>> GetRulesList(EquipmentLogsFilter filter)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var items = (await conn.QueryAsync<Rule>("[dbo].[EquipmentLogsRules]",
                    commandType: CommandType.StoredProcedure,
                    param: new
                    {
                        @Name = filter.Name,
                        @Page = filter.Page,
                        @ItemsPerPage = filter.ItemsPerPage,
                        @SortColumn = filter.SortColumn,
                        @SortDirection = filter.SortDirection.ToString(),
                        @CompanyId = _currentUser.User.CompanyId
                    })).ToList();

                /** Потому что Dapper не поддерживает сложный биндинг */

                var conditions = (await conn.QueryAsync<Condition>(
                    "SELECT * from [dbo].[EquipmentLogRuleConditions] WHERE RuleId IN @Rules",
                    param: new
                    {
                        @Rules = items.Select(x => x.Id).ToList()
                    })).ToList();

                if (conditions.Count > 0)
                {
                    foreach (var rule in items)
                    {
                        rule.Conditions = conditions.Where(x => x.RuleId == rule.Id).ToList();
                    }
                }
                

                var totalCount = await conn.QuerySingleAsync<int>("[dbo].[EquipmentLogsRulesCount]",
                    commandType: CommandType.StoredProcedure,
                    param: new
                    {
                        @Name = filter.Name
                    });

                return new PaginationModel<Rule>()
                {
                    Items = items,
                    Total = totalCount
                };
            }
        }

        public async Task<Rule> Store(Rule model, AppUser user)
        {
            if (model.Id == 0)
            {
                model.DateCreate = DateTimeOffset.Now;
                model.CreatorId = user.Id;
                model.CompanyId = model.CompanyId;
                _dbContext.EquipmentLogRules.Add(model);
            }
            else
            {
                var previous = await _dbContext.EquipmentLogRules
                    .Include(x => x.Conditions)
                    .FirstOrDefaultAsync(x => x.Id == model.Id);
                if(previous == null) throw new ArgumentException($"Правило не найдено {model.Id}", nameof(model));

                if (!_accessControlService.HasAccess(previous))
                {
                    throw new InvalidOperationException("Нет доступа");
                }

                previous.Description = model.Description;
                previous.OnCondition = model.OnCondition;
                previous.EmailAddress = model.EmailAddress;
                previous.Action = model.Action;
                previous.Name = model.Name;

                var newConditionIds = model.Conditions.Select(x => x.Id);
                var toRemove = previous.Conditions.Where(x => newConditionIds.Contains(x.Id) == false).ToList();
                _dbContext.EquipmentLogRuleConditions.RemoveRange(toRemove);
                
                var toAdd = model.Conditions.Where(x => x.Id == 0).ToList();
                toAdd.ForEach(x => x.RuleId = model.Id);
                _dbContext.EquipmentLogRuleConditions.AddRange(toAdd);
                
                var toUpdate = previous.Conditions.Where(x => newConditionIds.Contains(x.Id)).ToList();
                toUpdate.ForEach(condition =>
                {
                    var source = model.Conditions.First(x => x.Id == condition.Id);
                    condition.SeverityId = source.SeverityId;
                    condition.EquipmentId = source.EquipmentId;
                    condition.ErrorBody = source.ErrorBody;
                    condition.ErrorsNumber = source.ErrorsNumber;
                    condition.PeriodLength = source.PeriodLength;
                    condition.Period = source.Period;
                    condition.Position = source.Position;
                });
            }
            await _dbContext.SaveChangesAsync();
            _dataBus.Rules.Add(model);
            return model;
        }

        public async Task<bool> ChangeActivity(int id, bool value, AppUser user)
        {
            var rule = await _dbContext.EquipmentLogRules
                .FirstOrDefaultAsync(x => x.Id == id);
            if(rule == null) throw new ArgumentException($"Правило не найдено {id}", nameof(id));

            if (!_accessControlService.HasAccess(rule))
            {
                throw new InvalidOperationException("Нет доступа");
            }

            rule.IsActive = value;
            await _dbContext.SaveChangesAsync();
            _dataBus.Rules.Add(rule);
            return value;
        }

        public async Task<Rule> Get(int id)
        {
            return await _dbContext.EquipmentLogRules
                .Include(x => x.Conditions)
                .AsNoTracking()
                .WhereCompany(_currentUser.User.CompanyId)
                .FirstOrDefaultAsync(x => x.Id == id);

        }

        public async Task<int> Remove(int id)
        {
            var entity = await _dbContext.EquipmentLogRules
                .AsNoTracking()
                .WhereCompany(_currentUser.User.CompanyId)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (!_accessControlService.HasAccess(entity))
            {
                throw new InvalidOperationException("Нет доступа");
            }

            _dbContext.EquipmentLogRules.Attach(entity);
            _dbContext.Remove(entity);
            var result = await _dbContext.SaveChangesAsync();
            entity.IsActive = false;
            _dataBus.Rules.Add(entity);
            return result;}
    }
}
