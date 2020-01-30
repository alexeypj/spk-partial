using System.ComponentModel.DataAnnotations;

namespace sopka.Models.ContextModels.Directories
{
	public class EquipmentDirectory
	{
		public int Id { get; set; }

		[MaxLength(250)]
		public string Title { get; set; }

		[MaxLength(450)]
		public string Description { get; set; }
	}
}
