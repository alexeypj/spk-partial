using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using sopka.Models.Abstract;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
    public class Incident: IOwnedByCompany
    {
        public int Id { get; set; }

        public int AttackType { get; set; }

        public string Title { get; set; }

        public DateTimeOffset FixationTime { get; set; }

        public DateTimeOffset? DecisionTime { get; set; }

		public int? IdStatus { get; set; }
		
		public string StatusComment { get; set; }

        public string Description { get; set; }

        public string DetectionMethod { get; set; }

        public string SourceIP { get; set; }

        public string SourceURL { get; set; }

        public string SourceCountry { get; set; }

        public string SourceAddress { get; set; }

        public int? Criticality { get; set; }

        public int? SourceEquipmentId { get; set; }

        public string CreatorUserId { get; set; }

        public string UpdaterUserId { get; set; }

        public string ResponsibleUserId { get; set; }
	    
        public DateTimeOffset? CreateDate { get; set; }

        public DateTimeOffset? UpdateDate { get; set; }

		/// <summary>
		/// Рекомендации по блокировке
		/// </summary>
		public string BlockingRecommendations { get; set; }

		/// <summary>
		/// Рекомендации по устранению последствий
		/// </summary>
		public string MitigationRecommendations { get; set; }

		/// <summary>
		/// Рекомендации по предотвращению подобный инцидентов
		/// </summary>
		public string PreventionRecommendations { get; set; }

        public int? CompanyId { get; set; }

        public AttackDirectory AttackDirectory { get; set; }

        public Equipment SourceEquipment { get; set; }

        public AppUser CreatorUser { get; set; }

        public AppUser UpdaterUser { get; set; }

        public AppUser ResponsibleUser { get; set; }


        public IncidentStatus Status { get; set; }


        /// <summary>
		/// Инциденты, НА которые ссылается текущий
		/// </summary>
		public List<IncidentRelation> RelatedIncidents { get; set; }

        /// <summary>
        /// Инциденты, которые ссылаются НА текущий
        /// </summary>
        public List<IncidentRelation> RelatedIncidentOf { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public List<IncidentStatusHistory> History { get; set; }

        [JsonIgnore]
        public List<IncidentArticle> RelatedArticles { get; set; }
    }

    public class IncidentRelation
    {
        public int SourceIncidentId { get; set; }

        public int RelatedIncidentId { get; set; }

		[JsonIgnore]
        public Incident SourceIncident { get; set; }

        [JsonIgnore]
		public Incident RelatedIncident { get; set; }
    }
}