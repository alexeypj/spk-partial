using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using sopka.Models;
using sopka.Services;

namespace sopka.Helpers.Authorization
{
    public class AuthorizationHandler: IAuthorizationHandler
    {
        private readonly CurrentUser _currentUser;

        public AuthorizationHandler(CurrentUser currentUser)
        {
            _currentUser = currentUser;
        }

        public Task HandleAsync(AuthorizationHandlerContext context)
        {
            if (!_currentUser.IsAuthenticated)
            {
                return Task.CompletedTask;
            }

            var pendingRequirements = context.PendingRequirements.ToList();
            foreach (var requirement in pendingRequirements)
            {
                if (requirement is SuperAdminRequirement superAdminRequirement)
                {
                    if (!_currentUser.IsCompanyMember)
                    {
                        context.Succeed(superAdminRequirement);
                    }
                }

                if (requirement is SuperAdminOrPaidCompanyRequirement superAdminOrPaidCompanyRequirement)
                {

                    if (!_currentUser.IsCompanyMember || _currentUser.IsPaidCompany)
                    {
                        context.Succeed(superAdminOrPaidCompanyRequirement);
                    }
                }

                if (requirement is CompanyUserRequirement companyUserRequirement)
                {

                    if (_currentUser.IsCompanyMember)
                    {
                        context.Succeed(companyUserRequirement);
                    }
                }
            }

            return Task.CompletedTask;
        }
    }
}