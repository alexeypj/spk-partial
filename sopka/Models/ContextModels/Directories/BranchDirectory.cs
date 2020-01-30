using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Directories
{
	public class BranchDirectory
	{
		public int Id { get; set; }

		[MaxLength(250)]
		public string Title { get; set; }

		[MaxLength(450)]
		public string Description { get; set; }

		[JsonIgnore]
		public List<ObjectEntry> Objects { get; set; }
	}
}
