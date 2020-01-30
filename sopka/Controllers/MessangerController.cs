using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using sopka.Helpers;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Chat;
using sopka.Models.Enum;
using sopka.Services;
using sopka.Services.Chat;

namespace sopka.Controllers
{
    [Authorize]
    public class MessengerController: Controller
    {
        private readonly MessengerService _messengerService;
        private readonly UserConnectionsService _userConnections;
        private readonly ActionLogger _actionLogger;
        private readonly CurrentUser _currentUser;
        private readonly UserManager<AppUser> _userManager;
        private readonly SopkaDbContext _dbContext;

        public MessengerController(
            MessengerService messengerService,
            UserConnectionsService userConnections,
            ICompositeViewEngine viewEngine, 
            ActionLogger actionLogger, 
            CurrentUser currentUser, 
            UserManager<AppUser> userManager, SopkaDbContext dbContext)
        {
            _messengerService = messengerService;
            _userConnections = userConnections;
            _actionLogger = actionLogger;
            _currentUser = currentUser;
            _userManager = userManager;
            _dbContext = dbContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Получить онлайн статус пользователя
        /// </summary>
        /// <param name="userId">номер пользователя</param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetUserOnlineStatus(string userId)
        {
            var status = _userConnections.CheckIfUserOnline(userId);
            return Json(ServiceActionResult.GetSuccess(entity: status));
        }

        /// <summary>
        /// Получить онлайн статус пользователя
        /// </summary>
        /// <param name="userName">имя пользователя</param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetUserOnlineStatusByName(string userName)
        {
            var status = _userConnections.CheckIfUserOnline(userName);
            return Json(ServiceActionResult.GetSuccess(entity: status));
        }

        /// <summary>
        /// Получить список сообщений
        /// </summary>
        /// <param name="take">размер буфера</param>
        /// <param name="from">номер сообщения, дата которого задает границу для загрузки более старых сообщений</param>
        /// <param name="conversationId">номер чата</param>
        /// <param name="messageId">номер сообщения, которое необходимо включить в список загруженных сообщенй (используется для поиска)</param>
        /// <param name="showUnread">включить в список все непрочитанные сообщения</param>
        /// <returns></returns>
        public async Task<IActionResult> GetMessages(int take, int? from, int conversationId, int? messageId, bool showUnread)
        {
            _actionLogger.Log(LogActions.ConversationGetMessages, ActionEntityType.ConversationMessage, 
                parameters: new { take, fromMessageId = from, conversationId, shouldIncludeMessageId = messageId });
            var result = await _messengerService.GetMessages(take, from, conversationId, messageId, showUnread);
            return Json(result);
        }

        /// <summary>
        /// Получить количество непрочитанных сообщений
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> GetUnreadCount()
        {
            var result = await _messengerService.GetUnreadCount();
            return Json(result);
        }

        /// <summary>
        /// Получить список контактов
        /// </summary>
        /// <param name="type">тип контактов (фильтр)</param>
        /// <param name="includeConversation">добавить к каждому контакту приватный чат (если такой существует)</param>
        /// <returns></returns>
        public async Task<IActionResult> GetContactList(ContactType type, bool includeConversation = true)
        {
            var result = await _messengerService.GetContactList(User, type, includeConversation);
            return Json(ServiceActionResult.GetSuccess(entity: result));
        }

        /// <summary>
        /// Получить все чата, в которых присутствует данный пользователь
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> GetConversations()
        {
            var result = await _messengerService.GetConversationViewModels();
            return Json(ServiceActionResult.GetSuccess(entity: result));
        }

        /// <summary>
        /// Получить список прикрепленных файлов в разрезе одного чата
        /// </summary>
        /// <param name="conversationId">номер чата</param>
        /// <returns></returns>
        public async Task<IActionResult> GetAttachments(int conversationId)
        {
            var result = await _messengerService.GetAttachments(conversationId);
            return Json(ServiceActionResult.GetSuccess(entity: result));
        }

        /// <summary>
        /// Найти сообщения в разрезе одного чата
        /// </summary>
        /// <param name="conversationId">номер чата</param>
        /// <param name="term">параметр поиска</param>
        /// <returns>массив номеров сообщений</returns>
        public async Task<IActionResult> SearchMessages(int conversationId, string term)
        {
            if (string.IsNullOrWhiteSpace(term) == false)
            {
                var result = await _messengerService.SearchMessagesInConversation(conversationId, term);
                return Json(ServiceActionResult.GetSuccess(entity: result));
            }
            else
            {
                return Json(ServiceActionResult.GetFailed());
            }
        }

        /// <summary>
        /// Прочитать сообщения
        /// </summary>
        /// <param name="model">список сообщений</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> SeenMessages([FromBody] ReadMessagesModel model)
        {
            var result = await _messengerService.SetMessageStatus(model.MessageIds, model.ConversationUserId, _currentUser.User.Id, model.ConversationId, this.GetConnectionId(), MessageStatus.Seen);

            var logAction = result.Success ? LogActions.ConversationMessageStatusUpdated : LogActions.ConversationMessageStatusUnsuccessUpdate;
            _actionLogger.Log(logAction, ActionEntityType.ConversationMessageStatus, parameters: model);

            return Json(result);

        }

        /// <summary>
        /// Отправить сообщение
        /// </summary>
        /// <param name="model">сообщение</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Send(ConversationMessage model)
        {
            var currentConnectionId = this.GetConnectionId();

            var result = await _messengerService.Send(model, Request.Form.Files.ToList(), currentConnectionId);

            var action = result.Success ? LogActions.MessageCreated : LogActions.MessageUnsuccessCreate;
            _actionLogger.Log(action, ActionEntityType.ConversationMessage, parameters: model);

            return Json(result);
        }

        /// <summary>
        /// Получить номер существующего чата или создать шаблон для новой
        /// </summary>
        /// <param name="model">параметры чата</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetConversation([FromBody] GetOrCreateConversationModel model)
        {
            string userId = _currentUser.User.Id;
            if (model.UserNames.Count > 0)
            {
                foreach (var userName in model.UserNames)
                {
                    var user = await _userManager.FindByNameAsync(userName);

                    if (user != null && !model.UserIds.Any(p => p == user.Id))
                    {
                        model.UserIds.Add(user.Id);
                    }
                }
            }

            model.UserIds = model.UserIds.Concat(new[] { userId }).Distinct().ToList();

            var result = await _messengerService.CreateConversation(model.UserIds.ToArray(), model.OrgIds, model.EntityId, model.EventTypeId, this.GetConnectionId(), model.ChatType);
            return Json(ServiceActionResult.GetSuccess(entity: result));
        }

        /// <summary>
        /// Создать чат
        /// </summary>
        /// <param name="model">параметры чата</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateConversation([FromBody] ConversationRequestModel model)
        {
            var userId = _currentUser.User.Id;
            model.UserIds = model.UserIds.Concat(new[] { userId }).Distinct().ToArray();

            var createdConversation =
                await _messengerService.CreateConversation(model.UserIds, model.ReferenceId, model.EventsId, model.EventTypeId, model.Topic, this.GetConnectionId(), model.ChatType, false);

            var action = createdConversation.Success ? LogActions.ConversationCreated : LogActions.ConversationUnsuccessCreate;

            _actionLogger.Log(action, ActionEntityType.Conversation, entityId: createdConversation.EntityId?.ToString(),
                parameters: model);

            return Json(createdConversation);
        }

        /// <summary>
        /// Изменить имя чата
        /// </summary>
        /// <param name="conversationId">номер чата</param>
        /// <param name="name">новое имя чата</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ChangeConversationName(int conversationId, string name)
        {
            var result = await _messengerService.ChangeConversationName(conversationId, name, this.GetConnectionId());
            var action = result ? LogActions.ConversationNameChanged.GetName() : LogActions.ConversationNameUnsuccessChanged.GetName();
            _actionLogger.Log(action, ActionEntityType.Conversation, entityId: conversationId.ToString(),
                parameters: new {name});
            return Json(result ? ServiceActionResult.GetSuccess() : ServiceActionResult.GetFailed());
        }

        /// <summary>
        /// Добавить пользователь в чат
        /// </summary>
        /// <param name="model">пользователи + параметры чата</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> AddUsersToConversation([FromBody] ConversationRequestModel model)
        {
            if (model?.ConversationId == null)
                return BadRequest("Отсутствует идентификатор чата");

            var result = await _messengerService.AddUsersToConversation(model.ConversationId.Value, this.GetConnectionId(), model.UserIds);

            var action = result.Count > 0 ? LogActions.ConversationUserAdded : LogActions.ConversationUserUnsuccessAdd;
            _actionLogger.Log(action, ActionEntityType.Conversation, entityId: model.ConversationId?.ToString(),
                parameters: model);

            return Json(ServiceActionResult.GetSuccess(entity: result));
        }

        /// <summary>
        /// Исключить участника чата из чата
        /// </summary>
        /// <param name="conversationUserId">номер участника чата</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> RemoveUserFromConversation(int conversationUserId)
        {
            var result = await _messengerService.RemoveUserFromConversation(conversationUserId, this.GetConnectionId());
            return Json(result ? ServiceActionResult.GetSuccess() : ServiceActionResult.GetFailed());
        }

        /// <summary>
        /// Отредактировать специальные права участника чата
        /// </summary>
        /// <param name="userId">номер участника чата</param>
        /// <param name="isAdmin">значение специальных прав</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> EditPermissions(int userId, bool isAdmin)
        {
            var result = await _messengerService.EditPermissions(userId, isAdmin, this.GetConnectionId());
            return Json(result ? ServiceActionResult.GetSuccess() : ServiceActionResult.GetFailed());
        }

        private string GetRandomPhrase(Random random, string[] arr)
        {
            var phrase = string.Empty;
            var used = new List<int>();
            for (var i = 0; i < arr.Length; i++)
            {
                var wordNum = 0;
                do
                {
                    wordNum = random.Next(0, arr.Length);
                } while (used.Contains(wordNum));
                used.Add(wordNum);
                phrase += arr[wordNum] + " ";
            }
            return phrase.Trim();
        }

        /// <summary>
        /// Сгенерировать определенное кол-во сообщений (для тестирования)
        /// </summary>
        /// <param name="text">текст сообщения</param>
        /// <param name="count">кол-во сообщений</param>
        /// <param name="originatorId">инициатор (номер пользователя)</param>
        /// <param name="receiverId">получатель (номер пользователя)</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> TestCreateMessagesForUsers(string text, int count, string originatorId, string receiverId)
        {
            if (count > 0)
            {
                var res = await _messengerService.CreateConversation(new string[] { originatorId, receiverId }, null, null, null, this.GetConnectionId(), ChatTypeEnum.Undefined, true);

                var convUser = (await _messengerService.GetConversationUsers(true, res.ConversationId.Value)).FirstOrDefault(p => p.UserId == originatorId);

                var messages = new List<ConversationMessage>();
                Random random = new Random();
                string[] phrase1 = { "эх", "ель", "что", "за",
                    "ель", "что", "за", "шишечки",
                    "на", "ней" };
                string[] phrase2 = { "птичка", "малого", "калибра", "называется",
                    "колибри" };
                string[] phrase3 = { "ах", "ель", "что", "за", "ель", "производство", "наша", "цель" };
                string[] phrase4 = { "мой", "костер", "в", "тумане", "светит", "искры", "гаснут", "на", "лету" };
                string[] phrase5 = { "ножками", "мотает", "рожками", "бодает", "крылышком", "жужжит" };
                string[] phrase6 = { "о", "зразы", "я", "бы", "съел", "какую-нибудь", "заразу" };
                string[] phrase7 = { "мне", "на", "форточку", "сел", "воробей", "с", "ненавидищем", "оком" };
                string[] phrase8 = { "пускай", "я", "мужчина", "уж", "не", "молодой", "я", "люблю", "вас", "мой", "ангел", "клянусь", "бородой" };

                for (int i = 1; i < count + 1; i++)
                {
                    var sec = random.Next(0, 61);
                    var msec = random.Next(0, 9999999);
                    var sendDate = DateTimeOffset.Now.Add(TimeSpan.FromSeconds(-sec)).Add(TimeSpan.FromTicks(-msec));
                    var phraseNumber = random.Next(1, 9);
                    var message = new ConversationMessage
                    {
                        Text = string.IsNullOrEmpty(text) ? GetRandomPhrase(random, phraseNumber == 1 ? phrase1 : phraseNumber == 2 ? phrase2 : phraseNumber == 3 ? phrase3 : phraseNumber == 4 ? phrase4 : phraseNumber == 5 ? phrase5 : phraseNumber == 6 ? phrase6 : phraseNumber == 7 ? phrase7 : phrase8) : text,
                        SendDate = sendDate,
                        OriginatorId = convUser.Id,
                        ConversationId = res.ConversationId.Value,
                        ToUsers = new[] { originatorId, receiverId }
                    };
                    messages.Add(message);
                }

                _dbContext.AddRange(messages);
                await _dbContext.SaveChangesAsync();

                    await _messengerService.UpdateConversationUserViewDate(convUser.Id, this.GetConnectionId());

                    for (int i = 0; i < messages.Count; i++)
                    {
                        messages[i].Id = messages[i].Id;
                        var vm = new MessageViewModel
                        {
                            Body = messages[i],
                            User = convUser
                        };
                        await _messengerService.NotifyNewMessage(vm, null);
                    }

                    return Json(ServiceActionResult.GetSuccess());
            }

            return Json(ServiceActionResult.GetFailed());
        }

    }
}