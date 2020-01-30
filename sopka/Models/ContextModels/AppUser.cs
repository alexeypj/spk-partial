using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using sopka.Models.Abstract;
using sopka.Models.EquipmentLogs.Rules;

namespace sopka.Models.ContextModels
{
    public class AppUser:IdentityUser, IOwnedByCompany
    {
		public string FIO { get; set; }

		public bool IsBlock { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string BlockReason { get; set; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public DateTimeOffset? BlockDate { get; set; }

        public int? CompanyId { get; set; }

        public Company Company { get; set; }

	    public IEnumerable<AppUserRole> UserRoles { get; set; }

		[JsonIgnore]
		public List<Article> Articles { get; set; }

		[JsonIgnore]
	    public static Func<AppUser, AppUser> CleanUp => (user) => new AppUser()
	    {
		    FIO = user.FIO,
		    BlockDate = user.BlockDate,
		    BlockReason = user.BlockReason,
		    Email = user.Email,
		    UserRoles = user.UserRoles,
		    Id = user.Id,
		    IsBlock = user.IsBlock,
		    UserName = user.UserName
	    };

        [JsonIgnore]
        public List<Rule> EquipmentLogRules { get; set; }

        /// <summary>
        /// Комментарии к уязвимостям
        /// </summary>
        [JsonIgnore]
        public List<VulnerabilityComment> VulnerabilityComments { get; set; }
    }
}
