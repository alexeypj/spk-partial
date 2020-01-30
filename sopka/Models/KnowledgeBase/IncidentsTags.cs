using System.Collections.Generic;

namespace sopka.Models.KnowledgeBase
{
	public class IncidentsTags
	{
		public int? PlatformId { get; set; }
		public int EquipmentTypeId { get; set; }
		public int? CpuTagId { get; set; }
		public List<int> MemoryTagId { get; set; }
		public List<int> HddTagId { get; set; }
		public List<int> RaidTagId { get; set; }
		public List<int> NetworkTagId { get; set; }
		public List<int> OsTagId { get; set; }
		public List<int> SoftwareTagId { get; set; }
		public int AttackTypeId { get; set; }
	}
}
