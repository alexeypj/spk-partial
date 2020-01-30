using Newtonsoft.Json;
using sopka.Models.ContextModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using sopka.Models.Abstract;

namespace sopka.Models.EquipmentLogs.Rules
{
    /// <summary>
    /// Правило обработки журналов оборудования
    /// </summary>
    [Table("EquipmentLogRules")]
    public class Rule: IOwnedByCompany
    {
        public enum PeriodType
        {
            Second,
            Minute,
            Hour
        }

        public enum ConditionType
        {
            /// <summary>
            /// Хотя бы одно 
            /// </summary>
            One,
            /// <summary>
            /// Все
            /// </summary>
            All,
            /// <summary>
            /// Все в определенном порядке
            /// </summary>
            AllInParticularOrder
        }

        public int? OnConditionPeriodLength { get; set; }

        public PeriodType? OnConditionPeriod { get; set; }

        /// <summary>
        /// Тип действия
        /// </summary>
        public enum ActionType
        {
            CreateIncident,
            SendEmail
        }
        
        public Rule()
        {
            Conditions = new List<Condition>();
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsActive { get; set; }

        public ConditionType OnCondition { get; set; }

        public ActionType Action { get; set; }

        public List<Condition> Conditions { get; set; }

        public string EmailAddress { get; set; }

        public string Description { get; set; }

        public DateTimeOffset? DateCreate {get;set;}

        public string CreatorId { get; set; }

        public int? CompanyId { get; set; }

        [JsonIgnore]
        public AppUser Creator { get; set; }
    }
}
