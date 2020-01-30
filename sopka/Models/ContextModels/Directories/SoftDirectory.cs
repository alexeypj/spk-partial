using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Directories
{
	public class SoftDirectory
	{
		public int Id { get; set; }

		[MaxLength(250)]
		public string Manufacturer { get; set; }

		[MaxLength(250)]
		public string Product { get;set; }

		[JsonIgnore]
		public List<Software> Software { get; set; }
	}
}
