using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Serialization;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Hubs;
using sopka.Infrastructure.Http;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.Identity;
using sopka.Models.Options;
using sopka.Models.Vulnerabilities;
using sopka.Services;
using sopka.Services.Chat;
using sopka.Services.Email;
using sopka.Services.EquipmentLogImport;
using sopka.Services.EquipmentLogMatcher;

namespace sopka
{
    public class Startup
    {
        //public Startup(Microsoft.Extensions.Hosting.IHostingEnvironment env)
        //{

        //}

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
           
            Configuration = configuration;
            new ConfigurationBuilder().SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json").Build();

        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            try
            {
                services.Configure<CookiePolicyOptions>(options =>
                {
                    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                    options.CheckConsentNeeded = context => true;
                    options.MinimumSameSitePolicy = SameSiteMode.None;
                });


                services.AddMvc()
                    .AddJsonOptions(options =>
                    {
                        var resolver = options.SerializerSettings.ContractResolver;
                        if (resolver != null)
                        {
                            var res = resolver as DefaultContractResolver;
                            res.NamingStrategy = null;  // <<!-- this removes the camelcasing
                        }
                    })
                    .AddRazorOptions(options => options.AllowRecompilingViewsOnFileChange = true)
                    .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

                services.AddDbContext<SopkaDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            
			
                services.AddIdentity<AppUser, AppRole>()
                    .AddUserManager<SopkaUserManager>()
                    .AddUserStore<UserStore<AppUser>>()
                    .AddEntityFrameworkStores<SopkaDbContext>()
                    .AddDefaultTokenProviders();
            
            

                services.Configure<IdentityOptions>(options =>
                {
                    options.Password.RequireUppercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequiredLength = 4;
                });

                services.ConfigureApplicationCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.LoginPath = "/Login";
                });

                services.AddScoped<DbContext, SopkaDbContext>();
                services.AddScoped<UserManager<AppUser>, SopkaUserManager>();
                services.AddScoped<UserStore<AppUser>>();
                services.AddScoped<InventoryService>();
                services.AddScoped<EquipmentService>();
                services.AddScoped<IncidentService>();
                services.AddScoped<DirectoriesService>();
                services.AddScoped<CurrentUser>();
                services.AddScoped<KnowledgeBaseService>();
                services.AddSingleton<PasswordGenerator>();
                services.AddSingleton(x => new EmailService(Configuration.GetSection("SmtpSettings").Get<SmtpSettings>()));
                services.AddScoped<ActionLogger>();
                services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, ClaimsPrincipalFactory>();
                services.AddScoped<LogActionService>();
                services.AddScoped<EquipmentLogsService>();
                services.AddScoped<EquipmentLogImportService>();
                services.AddScoped<EquipmentJournalService>();
                services.AddScoped<VulnerabilityService>();
                services.AddScoped<CompaniesService>();
                services.AddSingleton<ConcurrencyLevel>(x => new ConcurrencyLevel(Configuration.GetValue<int>("ConcurrencyLevel")));
                services.AddSingleton<EquipmentLogDataBus>();
                services.AddHostedService<EquipmentLogMatcher>();
                services.Configure<FileServiceOptions>(options => Configuration.GetSection("FileService").Bind(options));
                services.Configure<EquipmentLogOptions>(Configuration.GetSection("EquipmentLog"));
                services.Configure<VulnerabilityOptions>(Configuration.GetSection("Vulnerabilities"));
                services.AddScoped<FileService>();
                services.AddScoped<UserConnectionsService>();
                services.AddScoped<MessengerService>();
                services.AddScoped<InvoiceService>();
                services.AddScoped<BalanceService>();
                services.AddScoped<TariffService>();
                services.Configure<InstallationOptions>(options => Configuration.GetSection("Installation").Bind(options));

                services.Configure<FormOptions>(x =>
                {
                    x.ValueLengthLimit = Configuration.GetValue<int>("FileService:MaxUploadFileSize");
                    x.MultipartBodyLengthLimit = Configuration.GetValue<int>("FileService:MaxUploadFileSize");
                });

                services.AddAuthorization(options =>
                {
                    options.AddPolicy(PermissionPolicies.SuperAdmin,
                        builder => builder.AddRequirements(new SuperAdminRequirement()));
                    options.AddPolicy(PermissionPolicies.SuperAdminOrPaidCompany,
                        builder => builder.AddRequirements(new SuperAdminOrPaidCompanyRequirement()));
                    options.AddPolicy(PermissionPolicies.CompanyUser,
                        builder => builder.AddRequirements(new CompanyUserRequirement()));
                });

                services.AddScoped<IAuthorizationHandler, AuthorizationHandler>();
                services.AddScoped<AccessControlService>();

                services.AddSignalR();
            
            }
            catch (Exception error)
            {
                Program.WriteLogError(error.Message + Environment.NewLine + error.StackTrace);
                throw;
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            try
            {
                if (env.EnvironmentName.StartsWith(EnvironmentName.Development, StringComparison.InvariantCultureIgnoreCase))
                {
                    app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                    {
                        HotModuleReplacement = true,
                        EnvironmentVariables = new Dictionary<string, string>()
                        {
                            {"NODE_ENV", "development" }
                        }
                    });
                    app.UseDeveloperExceptionPage();
                }
                else
                {
                    app.UseExceptionHandler("/Error");
                    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                    app.UseHsts();
                }
                app.UseAuthentication();
                app.UseMiddleware<RequestFormLimitsMiddleware>();
                app.UseStatusCodePagesWithReExecute("/Error/Error{0}");

                app.UseHttpsRedirection();
                app.UseStaticFiles();
                app.UseCookiePolicy();
                app.UseSignalR(routes =>
                {
                    routes.MapHub<CompanyHub>("/companyhub");
                });

                app.UseMvc(routes =>
                {
                    routes.MapRoute(
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{id?}");

                    routes.MapSpaFallbackRoute(
                        name: "spa-fallback",
                        defaults: new { controller = "Home", action = "Index" });
                });
                TryCreateDefaultRolesAndUsers(app);
            }
            catch (Exception error)
            {
                Program.WriteLogError(error.Message + Environment.NewLine + error.StackTrace);
                throw;
            }
        }

        /// <summary>
        /// Конфигурация ролей и пользователей по умолчанию
        /// </summary>
        /// <param name="app">Провайдер конфигурации конвеера запросов</param>
        private void TryCreateDefaultRolesAndUsers(IApplicationBuilder app)
        {
            var serviceScopeFactory = app.ApplicationServices.GetService<IServiceScopeFactory>();
            using (var scope = serviceScopeFactory.CreateScope())
            {
                try
                {
                    var adminUser = new AppUser()
                    {
	                    FIO = "Администратор",
	                    Email = "admin@admin.ru",
	                    UserName = "admin"
                    };
                    CreateDefaultUser(adminUser, "admin", Roles.Admin, scope.ServiceProvider);

                    var user = new AppUser()
                    {
						FIO = "Пользователь",
	                    Email = "user@user.ru",
	                    UserName = "user"
                    };
                    CreateDefaultUser(user, "user", Roles.DutyShift, scope.ServiceProvider);
                }
                catch (Exception ex)
                {
                    var logger = scope.ServiceProvider.GetService<ILogger<Startup>>();
                    logger.LogError(ex, "Ошибка настройки ролей и пользователей по умолчанию");
                }
            }
        }

        private void CreateDefaultRole(string roleName, IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetService<RoleManager<AppRole>>();
            var logger = serviceProvider.GetService<ILogger<Startup>>();
            var role = Task.Run(() => roleManager.FindByNameAsync(roleName)).Result;
            if (role == null)
            {
                role = new AppRole(roleName);
                var result = Task.Run(() => roleManager.CreateAsync(role)).Result;
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(x => $"{x.Code}: {x.Description}"));
                    logger.LogCritical($"Не удалось создать роль '{roleName}': {errors}");
                }
            }
        }

        private void CreateDefaultUser(AppUser user, string password, string roleName, IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetService<UserManager<AppUser>>();
            var logger = serviceProvider.GetService<ILogger<Startup>>();

            var appUser = Task.Run(() => userManager.FindByNameAsync(user.UserName)).Result;
            if (appUser == null)
            {
                var result = Task.Run(() => userManager.CreateAsync(user, password)).Result;
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(x => $"{x.Code} ({x.Description})"));
                    logger.LogCritical($"Не удалось создать пользователя '{user.UserName}': {errors}");
                    return;
                }

                result = userManager.AddToRoleAsync(user, roleName).Result;
                if (!result.Succeeded)
                {
	                var errors = string.Join(", ", result.Errors.Select(x => $"{x.Code}: {x.Description}"));
	                logger.LogCritical(
		                $"Не удалось привязать пользователя {user.UserName} к роли '{roleName}': {errors}");
                }
            }
        }
    }
}
