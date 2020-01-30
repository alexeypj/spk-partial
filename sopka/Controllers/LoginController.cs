using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using sopka.Helpers;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.Enum;
using sopka.Services;
using sopka.Services.Email;

namespace sopka.Controllers
{
    public class LoginController : Controller
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private RoleManager<AppRole> _roleManager;
        private EmailService _emailService;
        private readonly ILogger<LoginController> _logger;
        private readonly ActionLogger _actionLogger;
        private readonly SopkaDbContext _dbContext;
	    private readonly PasswordGenerator _passwordGenerator;
	    private readonly UserStore<AppUser> _userStore;
        private readonly IConfiguration _config;

        public LoginController(SignInManager<AppUser> signInManager, 
            UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, EmailService emailService, ILogger<LoginController> logger, ActionLogger actionLogger, SopkaDbContext dbContext, 
            PasswordGenerator passwordGenerator, UserStore<AppUser> userStore, IConfiguration config)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _emailService = emailService;
            _logger = logger;
            _actionLogger = actionLogger;
            _dbContext = dbContext;
            _passwordGenerator = passwordGenerator;
            _userStore = userStore;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> Demo()
        {
            var demoLogin = _config["DemoEmail"];
            if (string.IsNullOrEmpty(demoLogin))
            {
                _logger.LogCritical($"Не указан логин для вохда в демо режим. " +
                                    $"login: '{demoLogin}'");
                return RedirectToAction("Index", "Home");
            }

            var user = await _userManager.FindByEmailAsync(demoLogin);
            if (user == null)
            {
                _logger.LogCritical($"Не найден пользователь для входа в демо режим. " +
                                    $"login: '{demoLogin}'");
                return Redirect("/Login/NoDemo");
            }

            await _signInManager.SignInAsync(user, false);
            _logger.LogDebug($"Вход в демо режим. login: '{demoLogin}'");
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> SignIn([FromBody]LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                var result =  new ServiceActionResult()
                {
                    Success = false,
                    Message = string.Join(". ", ModelState.GetErrors())
                };
                return Json(result);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
	            if (user.IsBlock)
	            {
		            _logger.LogInformation(1, $"Попытка авторизации заблокированного пользователя '{model.Email}'.");
		            return Json(new ServiceActionResult()
		            {
			            Success = false,
			            Message = "Доступ заблокирован. Вам необходимо связаться с технической поддержкой"
		            });
				}

                var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, false);
                if (result.Succeeded)
                {
                    _actionLogger.Log(LogActions.UserAuthorized,user.UserName, user.Id, null, logHeaders: true);
                    _logger.LogInformation(1, $"Пользователь: '{user.FIO ?? user.UserName}', Email: '{user.Email}' авторизовался.");
                    return Json(new ServiceActionResult() { Success = true });
                }
                _logger.LogInformation(1, $"Неверный пароль для пользователя '{model.Email}'.");
            }
            else
            {
                _logger.LogInformation(1, $"Попытка авторизации несущесвующим email '{model.Email}'.");
            }
            return Json(new ServiceActionResult()
            {
                Success = false,
                Message = "Неверный email или пароль"
            });
        }

        [HttpPost]
        public async Task<IActionResult> Restore([FromBody]RestoreModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new ServiceActionResult() {Success = false, Message = string.Join(", ", ModelState.GetErrors())});
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                _logger.LogInformation($"Попытка восстановление пароля несуществующим email: '{model.Email}'");
                return Json(new ServiceActionResult() {Success = false, Message = "Пользователь не найден"});
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var restoreUrl = Url.Action("ResetPassword", "Login", new {token = token}, 
                protocol: HttpContext.Request.Scheme);
            await _emailService.SendResetPassword(user.Email, restoreUrl);
            _logger.LogInformation($"Отправлено письмо для восстановление пароля. UserName: '{user.UserName}', Email: '{user.Email}'");
            return Json(new ServiceActionResult() {Success = true});
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new ServiceActionResult() {Success = false, Message = string.Join(", ", ModelState.GetErrors())});
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Json(new ServiceActionResult() {Success = false, Message = "Пользователь не найден"});
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (result.Succeeded)
            {
                _logger.LogInformation($"Пароль сброшен. UserName: '{user.UserName}', Email: '{user.Email}'");
            }
            else
            {
                _logger.LogWarning($"Неудачна попытка сброса пароля. UserName: '{user.UserName}', Email: '{user.Email}', " +
                                       $"Error: {string.Join(", ", result.Errors.Select(x => $"{x.Code} ({x.Description})"))}");
            }
            return Json(new ServiceActionResult()
            {
                Success = result.Succeeded,
                Message = string.Join(", ", result.Errors.Select(x => x.Description))
            });
        }

        public async Task<IActionResult> Support([FromBody] SupportModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new ServiceActionResult() {Success = false, Message = string.Join(", ", ModelState.GetErrors())});
            }
            await _emailService.SendToSupport(model.Email, model.Text);
            return Json(new ServiceActionResult() {Success = true});
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody]RegistrationModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new ServiceActionResult() {Success = false, Message = string.Join(", ", ModelState.GetErrors())});
            }
            var result = await CreateUser(model);
            return Json(result);
        }

        private async Task<ServiceActionResult> CreateUser(RegistrationModel model)
        {
            var existingUser = await _userManager.FindByEmailAsync(model.AdminEmail);
            if (existingUser != null)
            {
                var errorMessage = "Пользователь с указанным email уже существует";
                var parameters = new { model, error = errorMessage };
                _actionLogger.Log(LogActions.UserUnsuccessfulCreate, parameters: parameters);
                return ServiceActionResult.GetFailed(errorMessage);
            }

            var existingCompany = await _dbContext.Companies.FirstOrDefaultAsync(x => x.Name == model.CompanyName);
            if (existingCompany != null)
            {
                var errorMessage = "Указанная компания уже существует";
                var parameters = new { model, error = errorMessage };
                _actionLogger.Log(LogActions.UserUnsuccessfulCreate, parameters: parameters);
                return ServiceActionResult.GetFailed(errorMessage);
            }

            var company = new Company()
            {
                Name = model.CompanyName,
                TariffId = model.TariffId,
                CreateDate = DateTimeOffset.Now,
                ResponsiblePersonFIO = model.FIO,
                ResponsiblePersonEmail = model.AdminEmail,
                ResponsiblePersonPhone = model.PhoneNumber,
                Balance = new Balance()
                {
                    Value = 0m
                }
            };

            var tariff = _dbContext.Tariffs.SingleOrDefault(x => x.Id == model.TariffId);
            if (tariff == null || !tariff.IsActive)
            {
                var errorMessage = "Тариф не найден";
                var parameters = new { model, error = errorMessage };
                _actionLogger.Log(LogActions.UserUnsuccessfulCreate, parameters: parameters);
                return ServiceActionResult.GetFailed(errorMessage);
            }

            var companyTariff = new CompanyTariff()
            {
                TariffId = tariff.Id,
                EquipmentsCount = tariff.EquipmentsCount,
                ObjectsCount = model.ObjectsLimited ? 100 : 0
            };
            if (tariff.IsCloud)
            {
                companyTariff.UsersCount = model.UsersLimited ? model.UsersCount ?? 1 : 0;
                companyTariff.Support = model.Support;
                companyTariff.Price = CalculateCloudTariffPrice(model);
            }
            else
            {
                companyTariff.UsersCount = tariff.UsersCount;
                companyTariff.Support = tariff.Support;
                companyTariff.Price = tariff.Price;
            }

            company.CompanyTariff = companyTariff;
            _dbContext.Companies.Add(company);
            await _dbContext.SaveChangesAsync();

            var user = new AppUser()
            {
                UserName = model.AdminEmail,
                Email = model.AdminEmail,
                FIO = model.FIO,
                PhoneNumber = model.PhoneNumber,
                Id = Guid.NewGuid().ToString(),
                CompanyId = company.Id
            };

            var result = await _userManager.CreateAsync(user);

            var errors = new List<string>();

            if (result.Succeeded == false)
            {
                foreach (var error in result.Errors)
                {
                    errors.Add(error.Description);
                }
                return ServiceActionResult.GetFailed(string.Join(", ", result.Errors.Select(x => x.Description)));
            }
            else
            {

                var savedUser = await _userManager.FindByEmailAsync(user.Email);
                var password = _passwordGenerator.Get(); // для отправки письмом

                await _userStore.SetPasswordHashAsync(user, _userManager.PasswordHasher.HashPassword(user, password));
                await _userStore.Context.SaveChangesAsync();

                await _userManager.AddToRoleAsync(user, Roles.CompanyAdmin);
                await _emailService.NewUser(user.Email, savedUser.FIO, password);
            }
            return ServiceActionResult.GetSuccess();
        }

        private decimal CalculateCloudTariffPrice(RegistrationModel model)
        {
            decimal price = 2500;
            if (model.UsersLimited)
            {
                price += (model.UsersCount ?? 1) * 500m;
            }
            else
            {
                price += 4000m;
            }

            if (!model.ObjectsLimited)
            {
                price += 2500m;
            }

            if (model.Support)
            {
                price += 3300m;
            }

            return price;
        }

        public async Task<IActionResult> SignOut()
        {
            if (User.Identity.IsAuthenticated)
            {
                var userName = User.Identity.Name;
                await _signInManager.SignOutAsync();
                _logger.LogInformation($"Пользователь '{userName}' вышел.");
            }
            return RedirectToAction("Index", "Home");
        }
    }

    public class RegistrationModel
    {
        [Required]
        public string AdminEmail { get; set; }

        [Required]
        public string FIO { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string CompanyName { get; set; }

        [Required]
        public int TariffId { get; set; }

        public bool Support { get; set; }

        public bool UsersLimited { get; set; }

        public int? UsersCount { get; set; }

        public bool ObjectsLimited { get; set; }
    }

    public class SupportModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Text { get; set; }
    }

    public class RestoreModel
    {
        [Required(ErrorMessage = "Введите Email")]
        public string Email { get; set; }
    }

    public class ResetPasswordModel
    {
        [Required(ErrorMessage = "Введите Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Введите пароль")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Введите подтверждение пароля")]
        [Compare("NewPassword", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmNewPassword{ get; set; }

        [Required]
        public string Token { get; set; }
    }

    public class LoginModel
    {
        [Required(ErrorMessage = "Введите Email")]
        [Display(Name = "Email", Prompt = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Введите пароль")]
        [Display(Name = "Пароль", Prompt = "Пароль")]
        public string Password { get; set; }
    }

}