using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.EquipmentLogs.Rules
{
    [Table("EquipmentLogRuleConditions")]
    public class Condition
    {
        public int Id { get; set; }

        public int RuleId { get; set; }

        /// <summary>
        /// Позиция условия в порядке выполнения
        /// </summary>
        public int Position { get; set; }

        public int EquipmentId { get; set; }

        public int SeverityId { get; set; }

        /// <summary>
        /// Тело условия
        /// </summary>
        public string ErrorBody { get; set; }

        /// <summary>
        /// Количество ошибок
        /// </summary>
        public int ErrorsNumber { get; set; }

        /// <summary>
        /// Длина периода ошибок
        /// </summary>
        public int PeriodLength { get; set; }

        public Rule.PeriodType Period { get; set; }

        [JsonIgnore]
        public Equipment Equipment { get; set; }

        [JsonIgnore]
        public Rule Rule { get; set; }

        [JsonIgnore]
        public EquipmentLogSeverity Severity { get; set; }

        
    }
}
