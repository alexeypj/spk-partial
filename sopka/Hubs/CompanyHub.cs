using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using sopka.Models;
using sopka.Models.Messenger;
using sopka.Services;
using sopka.Services.Chat;


namespace sopka.Hubs
{
    [Authorize]
    public class CompanyHub : Hub
    {
        private readonly CurrentUser _currentUser;
        private readonly UserConnectionsService _userConnectionsService;
        private readonly MessengerService _messengerService;
        private readonly ILogger<CompanyHub> _logger;

        private const string AdminsGroup = "admins";

        public CompanyHub(CurrentUser currentUser, UserConnectionsService userConnectionsService, MessengerService messengerService, ILogger<CompanyHub> logger)
        {
            _currentUser = currentUser;
            _userConnectionsService = userConnectionsService;
            _messengerService = messengerService;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            await _userConnectionsService.UpdateConnection(Context.ConnectionId, Context.User);
            if (_currentUser.User?.CompanyId != null)
            {
                await AddToGroup(_currentUser.User.CompanyId.Value);
            }

            if (_currentUser.IsInRole(Roles.Admin))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, AdminsGroup);
            }

            await SendToCompany("Messenger", MessengerService.USER_ONLINE_STATUS_CHANGED,
                UserOnlineStatus.CreateInstance(_currentUser.User.Id, _currentUser.User.UserName, true), Context.ConnectionId);

            try
            {
                // current user got messages
                // await _messengerService.DeliveryMessagesForCurrentUser(Context.ConnectionId, _currentUser.User.Id);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex.Message, ex);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userName = Context.User.Identity.Name;

            var task = _userConnectionsService.UserDisconnected(Context.ConnectionId, Context.User);
            if (!_userConnectionsService.CheckIfUserOnline(userName))
            {
                if (!string.IsNullOrEmpty(_currentUser.User.Id))
                {
                    if (_currentUser.User?.CompanyId != null)
                    {
                        await RemoveFromGroup(_currentUser.User.CompanyId.Value);
                    }

                    if (_currentUser.IsInRole(Roles.Admin))
                    {
                        await Groups.RemoveFromGroupAsync(Context.ConnectionId, AdminsGroup);
                    }

                    await SendToCompany("Messenger", MessengerService.USER_ONLINE_STATUS_CHANGED,
                        UserOnlineStatus.CreateInstance(_currentUser.User.Id, _currentUser.User.UserName, false), Context.ConnectionId);
                }
            }
        }

        public void Broadcast(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.SendAsync("broadcastMessage", name, message);
        }

        public async Task AddToGroup(int companyId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(companyId));
        }

        public async Task RemoveFromGroup(int companyId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName(companyId));
        }

        /// <summary>
        /// Отправляет сообщения всем пользователям внутри компании и админам
        /// </summary>
        /// <param name="entity">Класс объектов сообщения (например Messenger)</param>
        /// <param name="method">Метод объекта</param>
        /// <param name="message">Данные сообщения</param>
        /// <param name="exceptId">Исключить пользователя с ConnectionId из списка получателей</param>
        /// <returns></returns>
        public async Task SendToCompany(string entity, string method,  object message, string exceptId)
        {
            if (string.IsNullOrEmpty(exceptId))
            {
                await Clients.Group(GroupName(GetCompanyId()))
                    .SendAsync(entity, method, message, Context.ConnectionId);
            }
            else
            {
                await Clients.GroupExcept(GroupName(GetCompanyId()), exceptId)
                    .SendAsync(entity, method, message, Context.ConnectionId);
            }

            await Clients.Group(AdminsGroup).SendAsync(entity, method, message, Context.ConnectionId);
        }

        private int GetCompanyId()
        {
            if (_currentUser.User?.CompanyId != null)
            {
                return _currentUser.User.CompanyId.Value;
            }
            return 0;
        }

        private string GroupName(int companyId)
        {
            return $"company{companyId}";
        }
    }
}
