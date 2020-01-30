using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Directories
{
	public class HDDDirectory
	{
		public int Id { get; set; }

		[MaxLength(250)]
		public string Title { get; set; }

		public double Volume { get; set; }

		[JsonIgnore]
		public List<HDD> HDD { get; set; }
	}
}
