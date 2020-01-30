using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using sopka.Models.EquipmentLogs;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Services.EquipmentLogMatcher.RuleMatcher
{
    public abstract class RuleMatcherBase
    {
        public int Id => Rule?.Id ?? 0;

        protected int ConditionPosition = -1;
        protected readonly Rule Rule;
        protected readonly List<Condition> Conditions;
        protected readonly Accumulator[] Accumulators;
        protected volatile RuleMatcherState[] State;
        protected readonly List<Func<string, bool>> ConditionParsers;

        protected RuleMatcherBase(Rule rule)
        {
            if(rule == null) throw new ArgumentNullException(nameof(rule));
            if(rule.Conditions == null || rule.Conditions.Any() == false) throw new ArgumentException("No conditions", nameof(rule));

            Rule = rule;
            Conditions = rule.Conditions.OrderBy(x => x.Position).ToList();
            ConditionParsers = new List<Func<string, bool>>(Conditions.Count);

            Accumulators = new Accumulator[Conditions.Count];
            State = new RuleMatcherState[Conditions.Count];

            for(var i = 0; i < Conditions.Count; i++)
            {
                var parser = new ConditionExpressionParser(Conditions[i].ErrorBody);
                ConditionParsers.Insert(i, parser.Parse());
                Accumulators[i] = new Accumulator(Conditions[i]);
                State[i] = new RuleMatcherState();
            }
        }

        /// <summary>
        /// Вычисления совпадения правила 
        /// </summary>
        /// <param name="log">Запись лога оборудования</param>
        /// <returns></returns>
        public void Process(EquipmentLog log)
        {
            UpdateAccumulators(log);
        }

        private void UpdateAccumulators(EquipmentLog log)
        {
            ConditionPosition = -1;
            while (MoveNext())
            {
                var accumulator = Accumulators[ConditionPosition];
                var result = MatchCondition(Conditions[ConditionPosition], log, ConditionParsers[ConditionPosition]);
                if (!result) continue;
                accumulator.Increment(log.Id);
                if (accumulator.IsTriggered)
                {
                    Interlocked.Exchange(ref State[ConditionPosition].TimeTriggered, DateTimeOffset.Now.ToUnixTimeSeconds());
                    Interlocked.Exchange(ref State[ConditionPosition].LogIds, accumulator.GetLogIds());
                }
            }
        }

        /// <summary>
        /// Очистка устаревших совпадений
        /// </summary>
        public void ClearOutdated()
        {
            foreach (var accumulator in Accumulators)
            {
                accumulator.ClearOutdated();
            }
        }

        /// <summary>
        /// Перемещение к следующему условию для проверки
        /// </summary>
        /// <returns></returns>
        protected abstract bool MoveNext();

        /// <summary>
        /// Сработало ли всё правило
        /// </summary>
        /// <param name="clearOutdatedFirst">Предварительное очищение устаревших данных</param>
        /// <remarks>
        /// Если метод вызывается не во время обработки логов,
        /// нужно установить флаг предварительной очистки для получения правильного результата
        /// </remarks>
        /// <returns></returns>
        public virtual bool IsTriggered(bool clearOutdatedFirst = false)
        {
            if (clearOutdatedFirst) ClearOutdated();
            return false;
        }

        private bool MatchCondition(Condition condition, EquipmentLog log, Func<string, bool> parser)
        {
            // учитываем, что в логе есть id оборудования и id критичности
            if (condition.EquipmentId == log.EquipmentId && condition.SeverityId == log.SeverityId)
            {
                return parser(log.Description);
            }
            return false;
        }

        public RuleAction CreateAction()
        {
            return new RuleAction(Rule, State);
        }

        public void Reset()
        {
            foreach (var accumulator in Accumulators)
                accumulator.Reset();

            State = new RuleMatcherState[Conditions.Count];
            for (var i = 0; i < Conditions.Count; i++)
            {
                State[i] = new RuleMatcherState();
            }
        }

        public List<EquipmentLogRuleState> GetState()
        {
            var result = new List<EquipmentLogRuleState>(Conditions.Count);
            for (var i = 0; i < Conditions.Count; i++)
            {
                result.Add(new  EquipmentLogRuleState(Conditions[i].Id, State[i].TimeTriggered, State[i].ToString(), Accumulators[i]));
            }
            return result;
        }

        public void RestoreState(IEnumerable<EquipmentLogRuleState> states)
        {
            foreach (var state in states)
            {
                for (var i = 0; i < Conditions.Count; i++)
                {
                    if (Conditions[i].Id == state.ConditionId)
                    {
                        if (state.LastTriggered.HasValue)
                        {
                            State[i].TimeTriggered = state.LastTriggered.Value;
                            State[i].Restore(state.LogIds);
                        }

                        if (string.IsNullOrEmpty(state.Accumulator) == false)
                        {
                            Accumulators[i].Restore(state.Accumulator);
                        }

                        break;
                    }
                }
            }
        }

        public IEnumerable<int> ConditionIds()
        {
            return Conditions.Select(x => x.Id);
        }
    }
}
