using System.Collections.Generic;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Directories
{
	public class OSDirectory
	{
		public int Id { get; set; }

		public string Manufacturer { get; set; }

		public string Product { get; set; }

		[JsonIgnore]
		public List<OperationSystem> OperationSystems { get; set; }

	}
}
