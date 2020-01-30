using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
	public class Software
	{
		public int Id { get; set; }

		[Column("idDevice")]
		public int IdDevice { get; set; }

		public int IdSoftDirectory { get; set; }

		[Column("sVersion")]
		public string Version { get; set; }

		[JsonIgnore]
		public Device Device { get; set; }

		[JsonIgnore]
		public SoftDirectory SoftDirectory { get; set; }
	}
}
