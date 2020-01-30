using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	public class AppUserRole : IdentityUserRole<string>
	{
		[JsonIgnore]
		public virtual AppUser User { get; set; }

		[JsonIgnore]
		public virtual AppRole Role { get; set; }
	}
}
