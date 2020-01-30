using System.Linq;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Services.EquipmentLogMatcher.RuleMatcher
{
    public class AtLeastOneMatcher : RuleMatcherBase
    {
        public AtLeastOneMatcher(Rule rule) : base(rule)
        {
        }

        /// <summary>
        /// Обходит условия до первого выполняющегося
        /// </summary>
        /// <returns></returns>
        protected override bool MoveNext()
        {
            if (Conditions.Count > ConditionPosition + 1)
            {
                if (ConditionPosition == -1 || Accumulators[ConditionPosition].IsTriggered== false)
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
            return Accumulators.Any(x => x.IsTriggered);
        }
    }
}
