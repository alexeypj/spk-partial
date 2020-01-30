using System.ComponentModel.DataAnnotations;

namespace sopka.Models.DTO
{
	public class IncidentSetStatus
	{
		[Required]
		[Range(1, int.MaxValue)]
		public int IncidentId { get; set; }

		[Range(1, int.MaxValue)]
		public int StatusId { get; set; }

		public string Comment { get; set; }
	}
}
