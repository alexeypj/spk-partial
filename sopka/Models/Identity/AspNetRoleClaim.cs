using sopka.Models.ContextModels;

namespace sopka.Models.Identity
{
	public class AspNetRoleClaim
	{
		public int Id { get; set; }
		public string ClaimType { get; set; }
		public string ClaimValue { get; set; }
		public int RoleId { get; set; }

		public virtual AppRole Role { get; set; }
	}
}
