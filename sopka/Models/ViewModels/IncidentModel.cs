using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace sopka.Models.ViewModels
{
    public class IncidentModel
    {
        public int Id { get; set; }

        [Required]
        public int AttackType { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public DateTimeOffset FixationTime { get; set; }

        public DateTimeOffset? DecisionTime { get; set; }

        public int IdStatus { get; set; }

        [Required]
        public string Description { get; set; }

        public string DetectionMethod { get; set; }

        public string SourceIP { get; set; }

        public string SourceURL { get; set; }

        public string SourceCountry { get; set; }

        public string SourceAddress { get; set; }

        public int? SourceEquipmentId { get; set; }

        public int? Criticality { get; set; }

        public string CreatorUserId { get; set; }

        public string UpdaterUserId { get; set; }

        public string ResponsibleUserId { get; set; }

        public DateTimeOffset CreateDate { get; set; }

        public DateTimeOffset UpdateDate { get; set; }

        public int[] RelatedIncidents { get; set; }

        public string BlockingRecommendations { get; set; }

        public string MitigationRecommendations { get; set; }

        public string PreventionRecommendations { get; set; }

        public List<IFormFile> Files { get; set; }
        public int[] RemovedFiles { get; set; }
    }
}