using System.Collections.Generic;
using sopka.Models.EquipmentLogs;
using sopka.Services.EquipmentLogMatcher.RuleMatcher;

namespace sopka.Services.EquipmentLogMatcher
{
    public class LogMatcherSubtask
    {
        public ICollection<RuleMatcherBase> Rules;
        public List<EquipmentLog> Logs;
    }
}
