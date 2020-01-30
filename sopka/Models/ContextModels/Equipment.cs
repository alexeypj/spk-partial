using Newtonsoft.Json;
using sopka.Models.EquipmentLogs.Rules;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using sopka.Models.Abstract;

namespace sopka.Models.ContextModels
{
	[Table("Equipments")]
	public class Equipment: IOwnedByCompany
	{
        public enum RecordsCheckPeriods
        {
            Day,
            Week,
            Month
        }

		public int Id { get; set; }

		public int IdObject { get; set; }

		[Column("eType")]
		public int Type { get; set; }

		[Column("eName")]
		public string Name { get; set; }

		[Column("eModel")]
		public string Model { get; set; }

		[Column("eLocation")]
		public string Location { get; set; }

		[Column("ePlatform")]
		public int? Platform { get; set; }
		
        public bool IsDeleted { get; set; }

        public int? RecordsMinCount { get; set; }

        public int? RecordsMaxCount { get; set; }

        public RecordsCheckPeriods? RecordsCheckPeriod { get; set; }

		public ObjectEntry ObjectEntry { get; set; }

		public List<Device> Devices { get; set; }

        public List<Incident> Incidents { get; set; }

        [JsonIgnore]
        public List<Condition> EquipmentLogRuleConditions { get; set; }

        public int? CompanyId { get; set; }
    }
}
