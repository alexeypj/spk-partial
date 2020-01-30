using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Directories;
using sopka.Models.DTO;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Models.Identity;
using sopka.Services;
using sopka.Services.Email;

namespace sopka.Controllers
{
    [Authorize]
    public class UsersController : Controller
    {
	    private readonly UserStore<AppUser> _userStore;
	    private readonly SopkaUserManager _userManager;
	    private readonly RoleManager<AppRole> _roleManager;
	    private readonly PasswordGenerator _passwordGenerator;
	    private readonly ILogger<UsersController> _logger;
	    private EmailService _emailService;
        private readonly ActionLogger _actionLogger;
        private readonly AccessControlService _accessControlService;
        private readonly CurrentUser _currentUser;

		public UsersController(UserStore<AppUser> userStore, 
			SopkaUserManager userManager, 
			RoleManager<AppRole> roleManager, 
			PasswordGenerator passwordGenerator, 
			EmailService emailService, 
			ILogger<UsersController> logger, ActionLogger actionLogger, AccessControlService accessControlService, CurrentUser currentUser)
	    {
		    _userStore = userStore;
		    _userManager = userManager;
		    _roleManager = roleManager;
		    _passwordGenerator = passwordGenerator;
		    _logger = logger;
            _actionLogger = actionLogger;
            _accessControlService = accessControlService;
            _currentUser = currentUser;
            _emailService = emailService;
	    }

        [Authorize(Policy = PermissionPolicies.SuperAdminOrPaidCompany, Roles = Models.Roles.SystemOrCompanyAdmin)]
        [HttpPost]
	    public async Task<IActionResult> Store([FromBody] AppUserWithRoles user)
	    {
            var creation = string.IsNullOrEmpty(user.Id);
		    try
		    {
			    if (user != null && ModelState.IsValid)
                {
                    if (string.IsNullOrEmpty(user.Id))
                    {
                        var checkResult = await _accessControlService.CheckForUserCreation();
                        if (!checkResult.Success)
                        {
                            return Ok(checkResult.Message);
                        }
                    }
                    var existingUser = await _userManager.FindByEmailAsync(user.Email);
                    if (existingUser != null && existingUser.Id == user.Id)
                    {
                        if (!_accessControlService.HasAccess(existingUser))
                        {
                            return Forbid();
                        }
                    }
				    if (existingUser != null && existingUser.Id != user.Id)
				    {
                        var errorMessage = "Username already exists";
                        var parameters = new {user, error = errorMessage};
                        if (creation)
                        {
                            _actionLogger.Log(LogActions.UserUnsuccessfulCreate, parameters: parameters);
                        }
                        else
                        {
                            _actionLogger.Log(LogActions.UserUnsuccessfulCreate, ActionEntityType.User, user.Id, user.FIO, parameters: parameters);
                        }
                        return Ok(errorMessage);
				    }

				    if (string.IsNullOrEmpty(user.Id))
				    {
					    user.Id = Guid.NewGuid().ToString();
				    }

				    user.UserName = user.Email;
				    IdentityResult result;

				    if (existingUser == null)
				    {
					    result = await _userManager.CreateAsync(user);
				    }
				    else
				    {
					    existingUser.FIO = user.FIO;
					    existingUser.PhoneNumber = user.PhoneNumber;
					    result = await _userManager.UpdateAsync(existingUser);
				    }

				    var errors = new List<string>();

				    if (result.Succeeded == false)
				    {
					    foreach (var error in result.Errors)
					    {
						    errors.Add(error.Description);
					    }
				    }
				    else
				    {
					    var savedUser = await _userManager.FindByEmailAsync(user.Email);
					    var password = _passwordGenerator.Get(); // для отправки письмом

						await _userStore.SetPasswordHashAsync(user, _userManager.PasswordHasher.HashPassword(user, password));
					    await _userStore.Context.SaveChangesAsync();
					    
					    var existingRoles = await _userManager.GetRolesAsync(savedUser);
					    if (user.Roles != null && user.Roles.Any())
					    {
						    var roles = await _roleManager.Roles.AsNoTracking().Where(x => user.Roles.Contains(x.Id)).ToListAsync();
						    var roleNames = roles.Select(x => x.Name).ToList();

						    var rolesToRemove = existingRoles.Except(roleNames).ToList();
						    var rolesToAdd = roleNames.Except(existingRoles).ToList();

						    await _userManager.RemoveFromRolesAsync(savedUser, rolesToRemove);
						    await _userManager.AddToRolesAsync(savedUser, rolesToAdd);
					    }

					    await _emailService.NewUser(user.Email, savedUser.FIO, password);
				    }

				    if (errors.Count > 0)
                    {
                        var parameters = new {user, errors};
                        if (creation)
                        {
                            _actionLogger.Log(LogActions.UserUnsuccessfulCreate, parameters: parameters);
                        }
                        else
                        {
                            _actionLogger.Log(LogActions.UserUnsuccessfulCreate, ActionEntityType.User, user.Id, user.FIO, parameters: parameters);
                        }
					    return Ok(string.Join(", ", errors));
				    }
                    _actionLogger.Log(creation ? LogActions.UserCreated : LogActions.UserEdited, ActionEntityType.User, 
                        user.Id, user.FIO, parameters: user);
                    return Ok(result);
                }
                return Ok(string.Join("\n", ModelState.GetErrors()));
			}
		    catch (Exception ex)
		    {
                var parameters = new { user, error= ex.Message };
                if (creation)
                {
                    _actionLogger.Log(LogActions.UserUnsuccessfulCreate, parameters: parameters);
                }
                else
                {
                    _actionLogger.Log(LogActions.UserUnsuccessfulCreate, ActionEntityType.User, user.Id, user.FIO, parameters: parameters);
                }
                _logger.LogError(ex.Message, user);
				return Ok(ex.Message);
		    }
	    }

		[HttpGet]
        public async Task<IActionResult> UserList(UsersFilter filter)
	    {
		    var query = _userManager.Users
			    .AsNoTracking()
			    .Include(x => x.UserRoles)
			    .ThenInclude(x => x.Role)
                .WhereCompany(_currentUser.User.CompanyId)
			    .AsQueryable();

		    if (string.IsNullOrEmpty(filter.FIO) == false)
		    {
			    query = query.Where(x => x.FIO.ToLower().StartsWith(filter.FIO.ToLower()));
		    }

		    if (string.IsNullOrEmpty(filter.Phone) == false)
		    {
			    query = query.Where(x => x.PhoneNumber.ToLower().StartsWith(filter.Phone.ToLower()));
			}

		    if (string.IsNullOrEmpty(filter.Email) == false)
		    {
			    query = query.Where(x => x.Email.ToLower().StartsWith(filter.Email.ToLower()));
		    }

		    if (string.IsNullOrEmpty(filter.RoleId) == false)
		    {
			    query = query.Where(x => x.UserRoles.Any(role => role.RoleId.Equals(filter.RoleId)));
		    }

		    if (filter.Status.HasValue)
		    {
			    query = query.Where(x => x.IsBlock == (filter.Status.Value == 1));
		    }

            var itemsQuery = query;
            Expression<Func<AppUser, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(AppUser.FIO):
                    order = x => x.FIO;
                    break;
                case "RoleId":
                    order = x => x.UserRoles.First().RoleId;
                    break;
                case nameof(AppUser.PhoneNumber):
                    order = x => x.PhoneNumber;
                    break;
                case nameof(AppUser.Email):
                    order = x => x.Email;
                    break;
                case nameof(AppUser.IsBlock):
                    order = x => x.IsBlock;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var users = await itemsQuery.Skip(filter.Skip)
			    .Take(filter.ItemsPerPage)
			    .ToListAsync();
		    for (var i = 0; i < users.Count; i++)
		    {
			    users[i] = AppUser.CleanUp(users[i]);
		    }

		    var result = new PaginationModel<AppUser>()
		    {
			    Items = users,
			    Total = await query.CountAsync()
		    };
			return Ok(result);
	    }

	    [HttpGet]
        public async Task<IActionResult> Roles()
	    {
		    return Ok(await _roleManager.Roles.AsNoTracking().OrderBy(x => x.Name).ToListAsync());
	    }

	    [HttpGet]
        [Authorize(Roles = Models.Roles.SystemOrCompanyAdmin)]
        public IActionResult GeneratePassword()
	    {
		    return Ok(_passwordGenerator.Get());
	    }

	    [HttpGet]
	    public async Task<IActionResult> Get(string id)
	    {
		    var user = await _userManager.Users
			    .AsNoTracking()
			    .Include(x => x.UserRoles)
			    .ThenInclude(x => x.Role)
			    .FirstOrDefaultAsync(x => x.Id == id);

            if (!_accessControlService.HasAccess(user))
            {
                return Forbid();
            }

            if (user != null)
		    {
			    return Ok(AppUser.CleanUp(user));
		    }

		    return NotFound();
	    }

	    [HttpPost]
        [Authorize(Roles = Models.Roles.SystemOrCompanyAdmin)]
        public async Task<IActionResult> UpdatePassword([FromBody] UserIdPassword model)
	    {
		    try
		    {
			    if (model != null && ModelState.IsValid)
			    {
				    var user = await _userManager.FindByIdAsync(model.UserId);
				    if (user == null) throw new Exception($"User not found {model.UserId}");
                    if (!_accessControlService.HasAccess(user))
                    {
                        return Forbid();
                    }

                    await _userStore.SetPasswordHashAsync(user, _userManager.PasswordHasher.HashPassword(user, model.Password));
					await _userStore.Context.SaveChangesAsync();

                    await _emailService.UpdatePassword(user.Email, model.Password);
                    _actionLogger.Log(LogActions.UserPasswordReset, ActionEntityType.User, model.UserId, user.FIO,
                        parameters: model);
                    return Ok(true);
			    }
                _actionLogger.Log(LogActions.UserUnsuccessfulPasswordReset, ActionEntityType.User, model?.UserId,
                    parameters:  new {model, errors = ModelState.GetErrors()});
                return Ok(string.Join("\n", ModelState.GetErrors()));
			}
		    catch (Exception ex)
		    {
			    _logger.LogError(ex.Message, model);
                _actionLogger.Log(LogActions.UserUnsuccessfulPasswordReset, ActionEntityType.User, model.UserId,
                    parameters: new { model, errors = ex.Message });
                return Ok(ex.Message);
		    }
		}

		[HttpPost]
        [Authorize(Roles = Models.Roles.SystemOrCompanyAdmin)]
        public async Task<IActionResult> BlockUser([FromBody] UserBlockReason model)
	    {
		    try
		    {
			    if (model != null && ModelState.IsValid)
			    {
				    var user = await _userManager.FindByIdAsync(model.UserId);
				    if (user == null) throw new Exception($"User not found {model.UserId}");
                    if (!_accessControlService.HasAccess(user))
                    {
                        return Forbid();
                    }

                    if (string.IsNullOrEmpty(model.Reason))
				    {
					    model.Reason = "Причина блокировки не указана";
				    }

				    var result = await _userManager.Block(user, model.Reason);
				    if (result.Succeeded == false)
				    {
					    var errors = new List<string>();
						foreach (var error in result.Errors)
					    {
						    errors.Add(error.Description);
					    }

                        _actionLogger.Log(LogActions.UserUnsuccessfulBlock, ActionEntityType.User, model.UserId, user.FIO,
                            parameters: new {model, errors});
                        return Ok(string.Join("\n", errors));
				    }

				    await _emailService.BlockUser(user.Email, true, model.Reason);
                    _actionLogger.Log(LogActions.UserBlocked, ActionEntityType.User, model.UserId, user.FIO,
                        parameters: model);
					return Ok(true);
			    }
                _actionLogger.Log(LogActions.UserUnsuccessfulBlock, ActionEntityType.User, model?.UserId,
                    parameters: new { model, errors = ModelState.GetErrors() });
                return Ok(string.Join("\n", ModelState.GetErrors()));
		    }
		    catch (Exception ex)
		    {
			    _logger.LogError(ex.Message, model);
                _actionLogger.Log(LogActions.UserUnsuccessfulBlock, ActionEntityType.User, model?.UserId,
                    parameters: new {model, errors = ex.Message });
                return Ok(ex.Message);
		    }
		}

	    [HttpPost]
        [Authorize(Roles = Models.Roles.SystemOrCompanyAdmin)]
        public async Task<IActionResult> UnblockUser([FromBody] UserBlockReason model)
	    {
		    try
		    {
			    if (model != null && string.IsNullOrEmpty(model.UserId) == false)
			    {
				    var user = await _userManager.FindByIdAsync(model.UserId);
				    if (user == null) throw new Exception($"User not found {model.UserId}");
                    if (!_accessControlService.HasAccess(user))
                    {
                        return Forbid();
                    }

                    var result = await _userManager.Unblock(user);
				    if (result.Succeeded == false)
				    {
					    var errors = new List<string>();
					    foreach (var error in result.Errors)
					    {
						    errors.Add(error.Description);
					    }
                        _actionLogger.Log(LogActions.UserUnsuccessfulUnBlock, ActionEntityType.User, model.UserId, user.FIO,
                            parameters: new { model, errors });
                        return Ok(string.Join("\n", errors));
				    }
				    await _emailService.BlockUser(user.Email, false);
                    _actionLogger.Log(LogActions.UserUnBlocked, ActionEntityType.User, model.UserId, user.FIO,
                        parameters: model);
				    return Ok(true);
			    }
                var errorMessage = "Id пользователя не указан";
                _actionLogger.Log(LogActions.UserUnsuccessfulUnBlock, ActionEntityType.User, model?.UserId,
                    parameters: new { model, errors = errorMessage });
                return Ok(errorMessage);
		    }
		    catch (Exception ex)
		    {
			    _logger.LogError(ex.Message, model);
                _actionLogger.Log(LogActions.UserUnsuccessfulUnBlock, ActionEntityType.User, model?.UserId,
                    parameters: new {model, errors = ex.Message });
			    return Ok(ex.Message);
		    }
	    }
	}
}