using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using sopka.Models;
using sopka.Models.ContextModels;

namespace sopka.Services
{
    /// <summary>
    /// Класс для работы с текущим пользователем
    /// </summary>
    public class CurrentUser
    {
        private readonly ClaimsPrincipal _principal;

        public CurrentUser(UserManager<AppUser> userManager, IHttpContextAccessor httpContext)
        {
            if (httpContext.HttpContext != null)
            {
                _principal = httpContext.HttpContext.User;
                IsAuthenticated = _principal.Identity.IsAuthenticated;
                if (IsAuthenticated)
                {
                    User = userManager.Users
                        .Include(x => x.UserRoles)
                        .ThenInclude(x => x.Role)
                        .Include(x => x.Company)
                        .SingleOrDefault(x => x.UserName == _principal.Identity.Name);
                }
            }
        }

        public bool IsAuthenticated { get; }

        public AppUser User { get; }

        public bool IsInRole(string role)
        {
            if (!IsAuthenticated)
            {
                return false;
            }
            return _principal.IsInRole(role);
        }

        public bool IsCompanyMember => User?.CompanyId.HasValue ?? false;

        public bool IsPaidCompany => User?.Company.PaidTo >= DateTimeOffset.Now.Date;
    }
}