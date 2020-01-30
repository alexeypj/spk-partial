using System;
using System.Linq;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Services.EquipmentLogMatcher.RuleMatcher
{
    public class AllMatcher : RuleMatcherBase
    {
        private readonly int _periodLength;

        public AllMatcher(Rule rule) : base(rule)
        {
            _periodLength = Accumulator.SecondsInPeriod(rule.OnConditionPeriodLength, rule.OnConditionPeriod);
        }

        /// <summary>
        /// Всегда обходит все условия
        /// </summary>
        /// <returns></returns>
        protected override bool MoveNext()
        {
            if (Conditions.Count > ConditionPosition + 1)
            {
                ConditionPosition++;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Правило считается сработавшим, если в течение заданного интервала срабатывали все условия
        /// </summary>
        /// <returns></returns>
        public override bool IsTriggered(bool clearOutdatedFirst = false)
        {
            base.IsTriggered(clearOutdatedFirst);
            var startDate = DateTimeOffset.Now.ToUnixTimeSeconds() - _periodLength;
            return State.All(x => x.TimeTriggered >= startDate);
        }
    }
}
