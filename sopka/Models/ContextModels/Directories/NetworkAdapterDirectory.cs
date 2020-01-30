using System.Collections.Generic;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Directories
{
	public class NetworkAdapterDirectory
	{
		public int Id { get; set; }

		public string Title { get; set; }

		public double Speed { get; set; }

		[JsonIgnore]
		public List<NetworkAdapter> NetworkAdapters { get; set; }
	}
}
