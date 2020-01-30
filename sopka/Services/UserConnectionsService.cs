using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Dapper;
using JobServer.Helpers;
using log4net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using sopka.Models;

namespace sopka.Services
{
    /// <summary>
    /// Класс предназначен для управления подключениями пользователей, выполнивших вход в систему
    /// </summary>
    public class UserConnectionsService
    {
        private readonly ILogger<UserConnectionsService> _logger;
        private readonly string _connectionString;
        private readonly CurrentUser _currentUser;
        private readonly SopkaDbContext _dbContext;

        public UserConnectionsService(IMemoryCache memoryCache, ILogger<UserConnectionsService> logger, SopkaDbContext dbContext, CurrentUser currentUser)
        {
            _memoryCache = memoryCache;
            _logger = logger;
            _currentUser = currentUser;
            _connectionString = dbContext.Database.GetDbConnection().ConnectionString;
            _dbContext = dbContext;
        }

        private static readonly ILog _log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private static readonly TimeSpan ConnectionTimeout = TimeSpan.FromHours(8);
        private static readonly TimeSpan ExpirationTimeout = TimeSpan.FromMinutes(5);
        private readonly IMemoryCache _memoryCache;

        /// <summary>
        /// Метод выполняет создание нового или продление текущего подключения пользователя
        /// </summary>
        /// <param name="contextConnectionId">Идентификатор подключения пользователя</param>
        /// <param name="contextUser">Текущий пользователь</param>
        /// <returns></returns>
        public async Task UpdateConnection(string contextConnectionId, IPrincipal contextUser)
        {
            try
            {
                var userId = _currentUser.User.Id;
                string name = contextUser?.Identity?.Name;

                using (var conn = new SqlConnection(_connectionString))
                {
                    var sql = $@"declare @sourceTbl TABLE(ConnectionId varchar(50),UserId nvarchar(450),LastAccess datetimeoffset(7),Ip varchar(20),IsConnected bit);
{UserConnectionContract.GetInsertSql("0", "@sourceTbl")};
{UserConnectionContract.GetMergeSql("@sourceTbl", true, true)}";
                    await conn.ExecuteScalarAsync(sql, new {
                        ConnectionId_0 = contextConnectionId,
                        UserId_0 = userId,
                        Ip_0 = string.Empty,
                        LastAccess_0 = DateTimeOffset.Now,
                        IsConnected_0 = true
                    });
                }

                _memoryCache.Remove(BuildKey(userId));
                if (name != null)
                {
                    _memoryCache.Remove(BuildKey(name));
                }
            }
            catch (Exception ex)
            {
                _log.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// Метод выполняет закрытие подключения пользователя
        /// </summary>
        /// <param name="contextConnectionId">Идентификатор подключения пользователя</param>
        /// <param name="contextUser">Текущий пользователь</param>
        /// <returns></returns>
        public async Task UserDisconnected(string contextConnectionId, IPrincipal contextUser)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    await conn.ExecuteScalarAsync("UPDATE [dbo].[UserConnections] SET [IsConnected] = 0 WHERE [ConnectionId] = @p1", new { p1 = contextConnectionId });
                }
            }
            catch (Exception ex)
            {
                _log.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// Метод выполняет удаление данных подключений пользователя в текущем подразделении
        /// </summary>
        /// <param name="userId">Идентификатор пользователя</param>
        /// <param name="userOrgId">Идентификатор подразделения</param>
        /// <returns></returns>
        public async Task CloseMyConnections(int userId)
        {
            try
            {
                string userName = null;
                var sql = $@"declare @userName nvarchar(256);
SELECT TOP 1 AspNetUsers = u.UserName FROM AspNetUsers u
	JOIN UserConnections c ON u.Id = c.UserId
WHERE c.UserId = {userId.ToString()};
DELETE FROM UserConnections WHERE UserId = {userId.ToString()};
SELECT @userName;";
                using (var conn = new SqlConnection(_connectionString))
                {
                    var result = await conn.ExecuteScalarAsync(sql);
                    if (result is string s)
                        userName = s;
                }

                _memoryCache.Remove(BuildKey(userId));
                if (!string.IsNullOrEmpty(userName))
                    _memoryCache.Remove(BuildKey(userName));
            }
            catch (Exception ex)
            {
                _log.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// Метод выполняет удаление данных подключений пользователя, кроме подключений в указанном подразделении
        /// </summary>
        /// <param name="userName">Имя пользователя</param>
        /// <returns></returns>
        public async Task CloseOpenedConnectionsExceptCurrent(string userName)
        {
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var sql = $@"DELETE c
FROM UserConnections c
	JOIN AspNetUsers u ON c.UserId = u.Id
WHERE u.NormalizedUserName=@userName";
                    await conn.ExecuteAsync(sql, new[] { new SqlParameter("userName", SqlDbType.NVarChar, 256) { Value = userName.ToUpperInvariant() } });
                }
            }
            catch (Exception ex)
            {
                _log.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// Метод выполняет проверку нахождения пользователя в сети
        /// </summary>
        /// <param name="userName">Логин пользователя</param>
        /// <returns>Метод возращет True, если последнее подключение пользователя было выполнено за последний <code>ConnectionTimeout</code> интервал времени, иначе - False</returns>
        public bool CheckIfUserOnline(string userName)
        {
            var cacheKey = BuildKey(userName);
            if (_memoryCache.TryGetValue(cacheKey, out bool value))
                return value;

            var isConnected = (from connection in _dbContext.UserConnections
                               join user in _dbContext.Users on connection.UserId equals user.Id
                               where user.NormalizedUserName == userName
                                  && !user.IsBlock
                                  && connection.IsConnected
                                  && connection.LastAccess > DateTimeOffset.Now.Add(-ConnectionTimeout)
                               select connection.ConnectionId).Any();

            _memoryCache.Set(cacheKey, isConnected, ExpirationTimeout);

            return isConnected;
        }

        /// <summary>
        /// Метод выполняет проверку нахождения пользователя в сети
        /// </summary>
        /// <param name="userId">Идентификатор пользователя</param>
        /// <returns>Метод возращет True, если последнее подключение пользователя было выполнено за последний <code>ConnectionTimeout</code> интервал времени, иначе - False</returns>
        public bool CheckIfUserOnlineByUserId(string userId)
        {
            var cacheKey = BuildKey(userId);
            if (_memoryCache.TryGetValue(cacheKey, out bool value))
                return value;

            using (var conn = new SqlConnection(_connectionString))
            {
                const string sql = @"IF EXISTS(SELECT TOP 1 1 FROM [UserConnections] WHERE UserId=@userId AND [IsConnected]=1 AND LastAccess > @lastAccess)
	SELECT CAST(1 as bit)
ELSE
	SELECT CAST(0 as bit)";
                var result = conn.ExecuteScalar(sql, new[]
                {
                    new SqlParameter("userId", SqlDbType.NVarChar) {Value = userId},
                    new SqlParameter("lastAccess", SqlDbType.DateTimeOffset){Value = DateTimeOffset.Now.Add(-ConnectionTimeout)},
                });
                var isConnected = Convert.ToBoolean(result);
                _memoryCache.Set(cacheKey, isConnected, ExpirationTimeout);
                return isConnected;
            }
        }

        /// <summary>
        /// Возвращает массив id пользователей, которые в сети
        /// </summary>
        /// <param name="userIds">Идентификаторы пользователей</param>
        /// <returns></returns>
        public List<string> CheckIfUsersOnline(List<string> userIds)
        {
            var result = new List<string>();
            foreach (var userId in userIds)
            {
                if (CheckIfUserOnline(userId))
                    result.Add(userId);
            }
            return result;
        }


        private string  BuildKey(string userName)
        {
            return $"user-connection:{userName.ToUpper()}";
        }

        private string BuildKey(int userId)
        {
            return $"user-connection:{userId.ToString()}";
        }
    }
}