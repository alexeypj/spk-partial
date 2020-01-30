using System.Collections.Generic;
using System.Linq;

namespace sopka.Services.EquipmentLogMatcher.RuleMatcher
{
    public class RuleMatcherState
    {
        public RuleMatcherState()
        {
            LogIds = new List<int>();
        }

        public long TimeTriggered;

        public List<int> LogIds;

        public void Restore(string logIds)
        {
            if (string.IsNullOrEmpty(logIds) == false)
            {
                LogIds = logIds.Split(",").Select(int.Parse).ToList();
            }
        }

        public override string ToString()
        {
            return string.Join(",", LogIds);
        }
    }
}
