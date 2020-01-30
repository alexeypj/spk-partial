using System;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using sopka.Helpers;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.Enum;

namespace sopka.Services
{
    public class ActionLogger
    {
        private static readonly ThreadLocal<JsonSerializer> _jsonSerializer = new ThreadLocal<JsonSerializer>(() => new JsonSerializer
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
            PreserveReferencesHandling = PreserveReferencesHandling.Objects,
            ObjectCreationHandling = ObjectCreationHandling.Replace
        });

        private readonly IHttpContextAccessor _contextAccessor;
        private readonly SopkaDbContext _dbContext;
        private readonly string _connectionStirng;
        private readonly CurrentUser _currentUser;

        public ActionLogger(IHttpContextAccessor contextAccessor, SopkaDbContext dbContext, CurrentUser currentUser)
        {
            _contextAccessor = contextAccessor;
            _dbContext = dbContext;
            _currentUser = currentUser;
            _connectionStirng = _dbContext.Database.GetDbConnection().ConnectionString;
        }

        public async Task Log(LogActions action, string userName, string userId, int? sessionId,
            ActionEntityType? entityType = null, string entityId = null, string entityTitle = null,
            object parameters = null, bool logHeaders = false)
        {
            await Log(EnumHelperX<LogActions>.Names[action], userName, userId, sessionId, entityType, 
                entityId, entityTitle, parameters, logHeaders);
        }

        public async Task Log(string action, string userName, string userId, int? sessionId, 
            ActionEntityType? entityType = null, string entityId = null, string entityTitle = null, object parameters = null, bool logHeaders = false)
        {
            var httpContext = _contextAccessor.HttpContext;
            JObject jsonParameters;
            if (parameters == null)
                jsonParameters = new JObject();
            else
            {
                try
                {
                    jsonParameters = JObject.FromObject(parameters, _jsonSerializer.Value);
                }
                catch (ArgumentException)
                {
                    jsonParameters = JObject.FromObject(new { parameters });
                }
            }

            var hasAction = EnumHelperX<LogActions>.TryGetValueFromName(action, out LogActions actionObj);
            httpContext.Request.Headers.TryGetValue("Referer", out var browserUrl);
            jsonParameters.Add(nameof(browserUrl), browserUrl.FirstOrDefault());
            var headers = httpContext.Request.Headers;
            var actionLog = new LogAction()
            {
                ActionName = action,
                IsMainAction = hasAction && EnumHelperX<LogActions>.HasAttribute(actionObj, typeof(IsMainAction)),
                UserName = userName,
                UserId = userId,
                EntityType = entityType,
                EntityId = entityId,
                EntityTitle = entityTitle,
                SessionId = sessionId,
                Date = DateTimeOffset.Now,
                Ip = httpContext.Connection.RemoteIpAddress.ToString(),
                Parameters = jsonParameters.ToString(Formatting.None),
                Url = browserUrl,
                CompanyId = _currentUser.User?.CompanyId,
                Headers = logHeaders ? JsonConvert.SerializeObject(headers) : null
            };

            using (var connection = new SqlConnection(_connectionStirng))
            {
                await connection.OpenAsync();
                var sql = "INSERT INTO LogAction " +
                          "(ActionName, IsMainAction, UserName, UserId, EntityType, EntityId, EntityTitle, SessionId, Date, Parameters, Url, CompanyId, Headers, Ip) VALUES (@ActionName, @IsMainAction, @UserName, @UserId, @EntityType, @EntityId, @EntityTitle, @SessionId, @Date, @Parameters, @Url, @CompanyId, @Headers, @Ip)";
                await connection.ExecuteAsync(sql, actionLog);
            }
        }

        public async Task Log(string action, ActionEntityType? entityType = null, string entityId = null, 
            string entityTitle = null, object parameters = null, bool logHeaders = false)
        {
            var httpContext = _contextAccessor.HttpContext;
            var principal = httpContext.User;
            var userName = principal.Identity.Name;
            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? sessionId = null;
            var sessionClaim = principal.FindFirst("SessionId");
            if (sessionClaim != null)
            {
                if (int.TryParse(sessionClaim.Value, out int sessionIdValue))
                {
                    sessionId = sessionIdValue;
                }
            }

            await Log(action, userName, userId, sessionId, entityType, entityId, entityTitle, parameters, logHeaders);
        }

        public async Task Log(LogActions action, ActionEntityType? entityType = null, string entityId = null,
            string entityTitle = null, object parameters = null, bool logHeaders = false)
        {
            await Log(EnumHelperX<LogActions>.Names[action], entityType, entityId, entityTitle, parameters, logHeaders);
        }
    }
}