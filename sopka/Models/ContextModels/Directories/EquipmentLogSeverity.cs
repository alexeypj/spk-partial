using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Models.ContextModels.Directories
{
    public class EquipmentLogSeverity
    {
        public int Id { get; set; }

        public string Title { get;set; }

        public string Synonyms { get;set;}

        [JsonIgnore]
        public List<Condition> EquipmentLogRuleConditions { get; set; }

    }
}
