using System.ComponentModel.DataAnnotations;
using sopka.Services.EquipmentLogMatcher;

namespace sopka.Models.EquipmentLogs.Rules
{
    /** Состояние правила обработки журналов оборудования */
    public class EquipmentLogRuleState
    {
        [Key]
        public int ConditionId { get; set; }

        public long? LastTriggered { get; set; }

        public string LogIds { get; set; }

        public string Accumulator { get; set; }

        public EquipmentLogRuleState() { }

        public EquipmentLogRuleState(int conditionId, long? state, string logIds, Accumulator accumulator)
        {
            ConditionId = conditionId;
            LastTriggered = state;
            LogIds = logIds;

            if (accumulator != null)
            {
                Accumulator = accumulator.ToString();
            }
        }
    }
}
