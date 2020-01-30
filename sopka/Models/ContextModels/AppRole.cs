using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels
{
	public class AppRole : IdentityRole
	{
		public AppRole() { }

		public AppRole(string roleName) : base(roleName) { }

        public string ShortTitle { get; set; }

		public IEnumerable<AppUserRole> UserRoles { get; set; }

		[JsonIgnore]
		public List<IncidentStatus> Statuses { get; set; }
	}
}
