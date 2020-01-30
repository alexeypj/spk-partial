using System.ComponentModel.DataAnnotations;

namespace sopka.Models.ContextModels.Directories
{
	public class PlatformDirectory
	{
		public int Id { get; set; }

		[MaxLength(250)]
		public string Manufacturer { get; set; }

		[MaxLength(250)]
		public string Product { get; set; }
	}
}
