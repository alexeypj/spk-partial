using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using sopka.Models.ContextModels;

namespace sopka.Helpers
{
    public class ClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser, AppRole>
    {
        public ClaimsPrincipalFactory(
            UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)
        {
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(AppUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);
            var sessionId = new Random().Next(int.MaxValue);
            identity.AddClaim(new Claim("SessionId", sessionId.ToString()));
            return identity;
        }
    }
}