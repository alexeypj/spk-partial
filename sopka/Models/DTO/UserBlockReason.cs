using System.ComponentModel.DataAnnotations;

namespace sopka.Models.DTO
{
	public class UserBlockReason
	{
		[Required]
		public string UserId { get; set; }

		public string Reason { get; set; }
	}
}
