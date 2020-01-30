using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
	/// <summary>
	/// Операционная система
	/// </summary>
	[Table("OperationSystem")]
	public class OperationSystem
	{
		public int Id { get; set; }

		[Column("idDevice")]
		public int IdDevice { get; set; }
		
		public int IdOSDirectory { get; set; }

		[Column("oVersion")]
		public string Version { get; set; }

		[JsonIgnore]
		public Device Device { get; set; }

		[JsonIgnore]
		public OSDirectory OSDirectory { get; set; }
	}
}
