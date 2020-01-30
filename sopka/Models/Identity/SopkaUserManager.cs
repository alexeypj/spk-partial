using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using sopka.Models.ContextModels;

namespace sopka.Models.Identity
{
	public class SopkaUserManager : UserManager<AppUser>
	{
		private readonly SopkaDbContext _context;
		public SopkaUserManager(SopkaDbContext context, IUserStore<AppUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<AppUser> passwordHasher, IEnumerable<IUserValidator<AppUser>> userValidators, IEnumerable<IPasswordValidator<AppUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<AppUser>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
		{
			_context = context;
		}

		public override async Task<IdentityResult> AddToRoleAsync(AppUser user, string role)
		{
			var roleEntity = await _context.Roles.AsNoTracking().FirstAsync(x => x.Name == role);
			_context.AppUserRoles.Add(new AppUserRole(){ UserId = user.Id, RoleId = roleEntity.Id});
			await _context.SaveChangesAsync();
			return IdentityResult.Success;
		}

		public override async Task<IdentityResult> AddToRolesAsync(AppUser user, IEnumerable<string> roles)
		{
			var roleEntities = await _context.Roles.AsNoTracking().Where(x => roles.Contains(x.Name)).ToListAsync();
			roleEntities.ForEach(x =>
			{
				_context.AppUserRoles.Add(new AppUserRole() {UserId = user.Id, RoleId = x.Id});
			});
			await _context.SaveChangesAsync();
			return IdentityResult.Success;
		}

		public override async Task<IdentityResult> RemoveFromRoleAsync(AppUser user, string role)
		{
			var roleEntity = await _context.Roles.AsNoTracking().FirstAsync(x => x.Name == role);
			var localRole = new AppUserRole() {UserId = user.Id, RoleId = roleEntity.Id};
			_context.AppUserRoles.Attach(localRole);
			_context.AppUserRoles.Remove(localRole);
			await _context.SaveChangesAsync();
			return IdentityResult.Success;
		}

		public override async Task<IdentityResult> RemoveFromRolesAsync(AppUser user, IEnumerable<string> roles)
		{
			var roleEntities = await _context.Roles.AsNoTracking().Where(x => roles.Contains(x.Name)).ToListAsync();
			roleEntities.ForEach(x =>
			{
				var localRole = new AppUserRole() {UserId = user.Id, RoleId = x.Id};
				_context.AppUserRoles.Attach(localRole);
				_context.AppUserRoles.Remove(localRole);
			});
			await _context.SaveChangesAsync();
			return IdentityResult.Success;
		}

		public override async Task<IList<string>> GetRolesAsync(AppUser user)
		{
			var result = await _context
				.AppUserRoles
				.Include(x => x.Role)
				.AsNoTracking()
				.Where(x => x.UserId == user.Id)
				.Select(x => x.Role.Name)
				.ToListAsync();
			
			return result;
		}

		public Task<IdentityResult> Block(AppUser user, string reason)
		{
			if (string.IsNullOrEmpty(reason)) reason = "Причина блокировки не указана";
			user.IsBlock = true;
			user.BlockDate = DateTimeOffset.Now;
			user.BlockReason = reason;
			return Store.UpdateAsync(user, CancellationToken.None);
		}

		public Task<IdentityResult> Unblock(AppUser user)
		{
			user.IsBlock = false;
			user.BlockDate = DateTimeOffset.Now;
			return Store.UpdateAsync(user, CancellationToken.None);
		}
	}
}
