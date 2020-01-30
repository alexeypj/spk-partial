using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace sopka.Models.ViewModels
{
	public class ArticleModel
	{
		public int Id { get; set; }

		[Required]
		public string Title { get; set; }

		[Required]
		[Range(1, Int32.MaxValue)]
		public int IdFolder { get; set; }

		public string Description { get; set; }

		public string Solution { get; set; }

		public List<IFormFile> Files { get; set; }
		public int[] RemovedFiles { get; set; }
        public int[] ImportedFiles { get; set; }
        public int? BaseIncidentId { get; set; }

        public int[] AttackTypeTags { get; set; }
		public int[] EquipmentTypeTags { get; set; }
		public int[] PlatformTags { get; set; }
		public int[] MemoryTags { get; set; }
		public int[] CPUTags { get; set; }
		public int[] RaidTags { get; set; }
		public int[] HddTags { get; set; }
		public int[] NetworkAdapterTags { get; set; }
		public int[] SoftwareTags { get; set; }
		public int[] OSTags { get; set; }

	}
}
