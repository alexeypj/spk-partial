using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using sopka.Models.Contracts;

namespace sopka.Infrastructure.Identity
{
	/// <summary>
	/// Класс расширений для карточки, выполневшего вход, пользователя
	/// </summary>
	public static class ClaimsPrincipalExtensions
	{
		/// <summary>
		/// Метод выполняет проверку выполнен ли вход для текущего пользователя
		/// </summary>
		/// <param name="principal">Текущий пользователь</param>
		/// <returns></returns>
		public static bool IsRegistered(this ClaimsPrincipal principal)
		{
			if (!(principal.Identity?.IsAuthenticated).GetValueOrDefault())
				return false;

			var windowsIdentity = principal.Identity as WindowsIdentity;
			if (windowsIdentity != null)
				return principal.HasClaim(claim => claim.Type == ClaimTypes.NameIdentifier);

			return true;
		}

		/// <summary>
		/// Метод проверяет наличие указанных прав у текущего пользователя
		/// </summary>
		/// <param name="principal">Текущий пользователь</param>
		/// <param name="permissions">Список прав</param>
		/// <returns>Возвращет True, если хотя бы одно из прав есть, иначе - False</returns>
		public static bool IsInPermissions(this ClaimsPrincipal principal, params string[] permissions)
		{
			if (!principal.Identity.IsAuthenticated)
				return false;
            
			return principal.HasClaim(x => x != null && x.Type == ClaimTypes.Role && permissions.Contains(x.Value));
		}

		

		/// <summary>
		/// Метод возвращет идентификатор текущего пользователя
		/// </summary>
		/// <param name="principal">Текущий пользователь</param>
		/// <returns>Идентификатор пользователя</returns>
		public static int? GetUserId(this ClaimsPrincipal principal)
		{
			if (!principal.Identity.IsAuthenticated)
				return null;

			var claim = principal.FindFirst(ClaimTypes.NameIdentifier);
			if (claim == null)
				return null;

			if (!int.TryParse(claim.Value, out int tmp))
				return null;

			return tmp;
		}

		/// <summary>
		/// Метод возвращет список всех прав текущего пользователя
		/// </summary>
		/// <param name="principal">Текущий пользователь</param>
		/// <returns>Список прав</returns>
		public static List<string> GetPermissions(this ClaimsPrincipal principal)
		{
			if (!principal.Identity.IsAuthenticated)
				return null;

			var claims = principal.FindAll(AspNetRoleClaimContract.PermissionClaimType);

			return claims.Select(x => x.Value).Distinct().OrderBy(x => x).ToList();
		}
	}
}
