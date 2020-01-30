using System.ComponentModel.DataAnnotations;

namespace sopka.Models.DTO
{
	public class UserIdPassword
	{
		[Required]
		public string UserId { get; set; }

		[Required]
		public string Password { get; set; }
	}
}
