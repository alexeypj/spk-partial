using System.Collections.Generic;
using sopka.Models.ContextModels;

namespace sopka.Models.DTO
{
	public class AppUserWithRoles : AppUser
	{
		public List<string> Roles { get; set; }
	}
}
