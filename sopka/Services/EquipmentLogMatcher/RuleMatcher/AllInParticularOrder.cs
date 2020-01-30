using System;
using System.Linq;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Services.EquipmentLogMatcher.RuleMatcher
{
    public class AllInParticularOrder : RuleMatcherBase
    {
        private readonly int _periodLength;

        public AllInParticularOrder(Rule rule) : base(rule)
        {
            _periodLength = Accumulator.SecondsInPeriod(rule.OnConditionPeriodLength, rule.OnConditionPeriod);
        }

        /// <summary>
        /// Обходит условия до первого не выполняющегося
        /// </summary>
        /// <returns></returns>
        protected override bool MoveNext()
        {
            if (Conditions.Count > ConditionPosition + 1)
            {
                if (ConditionPosition == -1 || Accumulators[ConditionPosition].IsTriggered)
                {
                    ConditionPosition++;
                    return true;
                }
            }
            return false;
        }

        public override bool IsTriggered(bool clearOutdatedFirst = false)
        {
            base.IsTriggered(clearOutdatedFirst);
            var startDate = DateTimeOffset.Now.ToUnixTimeSeconds() - _periodLength;
            return State.All(x => x.TimeTriggered >= startDate);
        }
    }
}
