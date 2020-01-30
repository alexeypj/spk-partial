using System;
using System.Linq.Expressions;
using sopka.Models.Identity;

namespace sopka.Models.Contracts
{
	public class AspNetRoleClaimContract
	{
		public const string PermissionClaimType = "Permission";

		public int Id { get; set; }
		public string ClaimValue { get; set; }
		public string ClaimType { get; set; }

		public static Expression<Func<AspNetRoleClaim, AspNetRoleClaimContract>> SelectExpression =
			obj => new AspNetRoleClaimContract
			{
				Id = obj.Id,
				ClaimType = obj.ClaimType,
				ClaimValue = obj.ClaimValue
			};
	}
}
