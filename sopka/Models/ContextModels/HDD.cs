using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using sopka.Models.ContextModels.Directories;

namespace sopka.Models.ContextModels
{
	public class HDD
	{
		public int Id { get; set; }
		
		[Column("idDevice")]
		public int IdDevice { get; set; }
		
		public int IdHDDDirectory { get; set; }

		[Column("hCount")]
		public int Count { get; set; }

		public int? IdRAIDDirectory { get; set; }

		[JsonIgnore]
		public Device Device { get; set; }

		public RAIDDirectory RaidDirectory { get; set; }

		public HDDDirectory HddDirectory { get; set; }
	}
}
