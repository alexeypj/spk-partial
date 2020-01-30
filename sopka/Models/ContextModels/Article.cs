using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using sopka.Models.Abstract;

namespace sopka.Models.ContextModels
{
	/// <summary>
	/// Статья в базе знаний
	/// </summary>
	public class Article: IOwnedByCompany
	{
        public Article()
        {
            RelatedIncidents = new List<IncidentArticle>();
        }
		public const string AttackTypeTags = "AttackType";
		public const string EquipmentTypeTags = "EquipmentType";
		public const string PlatformTags = "Platforms";
		public const string MemoryTags = "Memory";
		public const string CPUTags = "CPU";
		public const string RaidTags = "Raids";
		public const string HddTags = "HDD";
		public const string NetworkAdapterTags = "NetworkAdapters";
		public const string SoftwareTags = "Software";
		public const string OSTags = "OS";

		public int Id { get; set; }

		public int IdFolder { get; set; }

		public string Title { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Description { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Solution { get; set; }
		
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string IdCreator { get; set; }
		
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public DateTimeOffset? CreateDate { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? CompanyId { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public ArticleFolder Folder { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public List<ArticleTag> Tags { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public AppUser User { get; set; }

        public List<IncidentArticle> RelatedIncidents { get; set; }
	}
}
