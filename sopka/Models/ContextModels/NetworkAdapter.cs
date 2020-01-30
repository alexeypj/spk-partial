using Newtonsoft.Json;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
	public class NetworkAdapter
	{
		public int Id { get; set; }

		public int IdDevice { get; set; }

		public int IdNetworkAdapterDirectory { get; set; }

		[JsonIgnore]
		public Device Device { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public NetworkAdapterDirectory NetworkAdapterDirectory { get; set; }
	}
}
