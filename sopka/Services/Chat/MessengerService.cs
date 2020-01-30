using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using JobServer.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using sopka.Helpers;
using sopka.Hubs;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Chat;

namespace sopka.Services.Chat
{
    public class MessengerService
    {

        private readonly SopkaDbContext _dbContext;
        private readonly IHttpContextAccessor _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly FileService _fileService;
        private readonly UserConnectionsService _userConnections;
        private readonly CurrentUser _currentUser;
        private readonly IHubContext<CompanyHub> _hubContext;


        public const string USER_ONLINE_STATUS_CHANGED = "UserOnlineStatusChanged";

        public MessengerService(IHttpContextAccessor context, UserManager<AppUser> userManager,
            FileService fileService,
            UserConnectionsService userConnections,
            CurrentUser currentUser, SopkaDbContext dbContext, IHubContext<CompanyHub> hubContext)
        {
            _context = context;
            _userManager = userManager;
            _fileService = fileService;
            _userConnections = userConnections;
            _currentUser = currentUser;
            _dbContext = dbContext;
            _hubContext = hubContext;
            
        }
        
        /// <summary>
        /// Получить список сообщений по указанной чату
        /// </summary>
        /// <param name="take">сколько сообщений загрузить</param>
        /// <param name="fromMessageId">загрузить с определенного сообщения, не включая</param>
        /// <param name="conversationId">ID чата</param>
        /// <param name="messageId">ID сообщения, которое должно обязательно попасть в список</param>
        /// <param name="showUnread">обязательно показать первое непрочитанное сообщение</param>
        /// <returns>Список сообщений, обвернутый в ServiceActionResult</returns>
        public async Task<ServiceActionResult> GetMessages(int take, int? fromMessageId, int conversationId, int? messageId, bool showUnread)
        {
            var currentUserId = _currentUser.User.Id;
            var conversationUsers = await this.GetConversationUsers(true, conversationId);
            if (conversationUsers.All(u => u.UserId != currentUserId))
            {
                return ServiceActionResult.GetFailed("Нет доступа к сообщениям");
            }

            var currentSessionUser = conversationUsers.Single(u => u.UserId == currentUserId);
            var usersDictionary = conversationUsers.ToDictionary(u => u.Id);


            DateTimeOffset? shouldInclude = messageId.HasValue ?
                (await this.GetMessage(messageId.Value))?.SendDate : showUnread ?
                (DateTimeOffset?)currentSessionUser.LastConversationViewDate : null;

            var messages = await this.GetChunkOfMessages(take, conversationId, fromMessageId, shouldInclude, currentSessionUser.Id);

            if (messages.Item1.Count() == 0)
            {
                return ServiceActionResult.GetSuccess(entity: new
                {
                    messages = new List<MessageViewModel>(),
                    end = true
                });
            }

            foreach (var message in messages.Item1)
            {
                message.User = usersDictionary[message.Body.OriginatorId];
                message.IsOwn = currentSessionUser.Id == message.Body.OriginatorId;
            }

            return ServiceActionResult.GetSuccess(
                entity: new
                {
                    messages = messages.Item1,
                    end = (take > messages.Item1.Count() || messages.Item2)
                });

        }

        /// <summary>
        /// Получить часть сообщений
        /// </summary>
        /// <param name="take">Размер буфера</param>
        /// <param name="conversationId">Номер чата</param>
        /// <param name="from">Взять сообщения, дата которых меньше указанной</param>
        /// <param name="mustInclude">Должно включать дату</param>
        /// <param name="currentConversationUserId"></param>
        /// <returns>Список сообщений</returns>
        private async Task<(List<MessageViewModel>, bool)> GetChunkOfMessages(int take, int conversationId, int? fromMessageId, DateTimeOffset? mustInclude, int currentConversationUserId)
        {
            var result = new List<MessageViewModel>();
            var conversationEndReached = false;

            var query = _dbContext.ConversationMessages.Where(x => x.ConversationId == conversationId);

            if (fromMessageId > 0)
            {
                var fromMessage = await _dbContext.ConversationMessages.SingleOrDefaultAsync(x => x.Id == fromMessageId);
                DateTimeOffset? from = fromMessage?.SendDate;
                if (from.HasValue)
                {
                    query = query.Where(x => x.SendDate < from || (x.SendDate == from && x.Id < fromMessageId));
                }
            }
            if (mustInclude != null)
            {
                query = query.Where(x => x.SendDate >= mustInclude);
            }
            else
            {
                query = query.Take(take);
            }

            var messages = await query.OrderByDescending(x => x.SendDate).ToListAsync();

            messages = messages.Where(x => x.ToUsers.Contains(_currentUser.User.Id)).ToList();

            if (mustInclude.HasValue)
            {
                query = _dbContext.ConversationMessages.Where(x => x.ConversationId == conversationId);
                if (messages.Count > 0)
                {
                    var lastMessage = messages.LastOrDefault();
                    query = query.Where(x => x.SendDate < lastMessage.SendDate);
                }
                var includeMessages = await query.OrderByDescending(x => x.SendDate).Take(take).ToListAsync();
                includeMessages = includeMessages.Where(x => x.ToUsers.Contains(_currentUser.User.Id)).ToList();
                if (take > includeMessages.Count)
                    conversationEndReached = true;
                messages.AddRange(includeMessages);
            }

            if (messages.Count == 0)
            {
                return (result, conversationEndReached);
            }

            // load statuses
            var messageIds = messages.Select(x => x.Id).ToArray();
            var statuses = await _dbContext.ConversationMessageStatuses.Where(x => messageIds.Contains(x.MessageId)).ToListAsync();
            // files

            var files = (await _fileService.GetFiles(messageIds, typeof(ConversationMessage).Name.ToLower()))
                .Select(
                    t => new AttachmentViewModel
                    {
                        MessageId = t.ParentId,
                        Id = t.Id,
                        Name = t.Name
                    });

            foreach (var message in messages)
            {
                var statusesForMessage = statuses.Where(p => p.MessageId == message.Id /* && p.ConversationUserId != message.OriginatorId*/);
                MessageStatus? status = null;

                // сообщение текущего пользователя
                if (message.OriginatorId == currentConversationUserId)
                {
                    status = statusesForMessage.Any(p => p.GetStatus() == MessageStatus.Seen) ? MessageStatus.Seen : statusesForMessage.FirstOrDefault()?.GetStatus();
                }
                else
                {
                    status = statusesForMessage.FirstOrDefault(p => p.ConversationUserId == currentConversationUserId)?.GetStatus();
                }

                var messageVM = new MessageViewModel
                {
                    Status = status,
                    Attachments = files.Where(t => t.MessageId == message.Id).ToList(),
                    Body = message,
                    SendDate = message.SendDate
                };
                result.Add(messageVM);
            }

            return (result.OrderBy(x => x.SendDate).ToList(), conversationEndReached);
        }

        /// <summary>
        /// Загрузить сообщение
        /// </summary>
        /// <param name="messageId">ID сообщения</param>
        /// <returns>Экземпляр сообщения</returns>
        private async Task<ConversationMessage> GetMessage(int messageId)
        {
            var message = await _dbContext.ConversationMessages.SingleAsync(x => x.Id == messageId);
            return message.ToUsers.Contains(_currentUser.User.Id) ? message : null;
        }

        /// <summary>
        /// Выполнить поиск сообщений в чате
        /// </summary>
        /// <param name="conversationId">ID чата</param>
        /// <param name="term">Строка, по которой искать</param>
        /// <returns>Массив ID сообщений</returns>
        public async Task<(List<int> Results, bool SyntaxError, bool Overflow, List<string> higlightWords)> SearchMessagesInConversation(int conversationId, string term)
        {
            var result = new List<int>();
            var words = new List<string>();

            var query = term.ToLower().Trim();
            var messages = await _dbContext.ConversationMessages
                .Where(x => x.ConversationId == conversationId && x.Text.Contains(query))
                .OrderByDescending(x => x.SendDate)
                .ToListAsync();

            if (messages.Any())
            {
                messages = messages.Where(x => x.ToUsers.Contains(_currentUser.User.Id)).ToList();
                result = messages.Select(x => x.Id).ToList();
            }
            return (result, false, false, words);
        }

        /// <summary>
        /// Получить все прикрепленные файлы по определенное чату
        /// </summary>
        /// <param name="conversationId">ID чата</param>
        /// <returns>Коллекция прикрепленных файлов</returns>
        public async Task<List<AttachmentViewModel>> GetAttachments(int conversationId)
        {
            var result = new List<AttachmentViewModel>();
            var currentUserId = _currentUser.User.Id;

            var conversationUsers = await _dbContext.ConversationUsers.Where(x => x.ConversationId == conversationId).ToListAsync();

            if (conversationUsers.IsAny())
            {
                if (conversationUsers.All(t => t.UserId != currentUserId))
                {
                    return result;
                }

                var messages = await _dbContext.ConversationMessages.Where(x => x.ConversationId == conversationId)
                    .ToListAsync();

                if (messages.IsAny())
                {
                    var messagesIds = messages.Where(x => x.ToUsers.Contains(_currentUser.User.Id))
                        .Select(t => t.Id).ToArray();
                    result = (await _fileService.GetFiles(messagesIds, typeof(ConversationMessage).Name.ToLower()))
                            .Select(t => new AttachmentViewModel
                                        {
                                            MessageId = t.ParentId,
                                            Id = t.Id,
                                            Name = t.Name
                                        })
                            .ToList();
                }
            }

            return result.OrderBy(t => t.Name).ToList();
        }

        /// <summary>
        /// Получить список контактов
        /// </summary>
        /// <param name="user">текущий пользователь</param>
        /// <param name="type">тип пользователей</param>
        /// <param name="includeConversation">добавить чаты к результату</param>
        /// <returns>Коллекция контактов</returns>
        public async Task<List<ContactViewModel>> GetContactList(ClaimsPrincipal user, ContactType type, bool includeConversation)
        {
            var userId = _currentUser.User.Id;

            IEnumerable<AppUser> users = new List<AppUser>();

            switch (type)
            {
                case ContactType.All:
                    users = await _userManager
                        .Users
                        .Where(u => u.Id != userId).ToListAsync();
                    break;
            }

            var result = new List<ContactViewModel>();
            foreach (var u in users)
            {
                var contact = new ContactViewModel
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Name = u.FIO,
                    IsOnline = _userConnections.CheckIfUserOnline(u.Id)
                };
                result.Add(contact);
            }

            if (includeConversation)
            {
                var ownConversations = (await GetConversationsByUserId(userId)).Where(t => t.Entity.IsGroup != true);
                foreach (var item in result)
                {
                    item.Conversation = ownConversations.FirstOrDefault(t => t.Users.Any(p => p.UserId == item.Id));
                }
            }

            return result.ToList();
        }

        /// <summary>
        /// Получить все чаты текущего пользователя в удобном для мессенджера виде
        /// </summary>
        /// <returns>Коллекция чатов</returns>
        public async Task<List<ConversationViewModel>> GetConversationViewModels()
        {
            var userId = _currentUser.User.Id;
            var ownConversations = await GetConversationsByUserId(userId, true);
            return ownConversations.ToList();
        }

        /// <summary>
        /// Получить чат
        /// </summary>
        /// <param name="id">ID чата</param>
        /// <returns>чат</returns>
        public async Task<Conversation> GetConversationById(int id)
        {
            return await _dbContext.Conversations.SingleOrDefaultAsync(x => x.Id == id);
        }

        /// <summary>
        /// Получить список чатов
        /// </summary>
        /// <param name="ids">Массив ID чатов</param>
        /// <returns>Список чатов</returns>
        public async Task<List<Conversation>> GetConversationsByIds(params int[] ids)
        {
            if (ids.Any() == false) return new List<Conversation>();
            return await _dbContext.Conversations.Where(x => ids.Contains(x.Id)).ToListAsync();
        }

        /// <summary>
        /// Получить чат в удобном для мессенджера виде
        /// </summary>
        /// <param name="id">Номер чата</param>
        /// <returns>чат</returns>
        public async Task<ConversationViewModel> GetConversationViewModelById(int id)
        {
            var userId = _currentUser.User.Id;
            var convUsers = await this.GetConversationUsers(true, id);
            var convEntity = await this.GetConversationById(id);
            var result = new ConversationViewModel
            {
                Entity = convEntity,
                Users = convUsers,
                ReadOnly = !(convUsers.FirstOrDefault(x => x.UserId == userId)?.IsActive ?? false)
            };

            if (result.Users.All(p => p.UserId != userId))
            {
                return null;
            }

            result.LocalOriginatorId = result.Users.FirstOrDefault(p => p.UserId == userId).Id;
            return result;
        }

        /// <summary>
        /// Загрузить чаты пользователя
        /// </summary>
        /// <param name="userId">Id пользователя</param>
        /// <param name="includeGroups">включить ли групповые (больше 2х человек) чата</param>
        /// <returns>Список чатов</returns>
        public async Task<List<ConversationViewModel>> GetConversationsByUserId(string userId, bool includeGroups = false)
        {
            var result = new List<ConversationViewModel>();
            var actualConvUsers = await _dbContext.ConversationUsers.Where(x => x.UserId == userId).ToListAsync();

            if (actualConvUsers.IsAny())
            {
                var currentUsers = actualConvUsers.Where(x => x.ConversationId > 0).ToList();
                var conversations = await this.GetConversationsByIds(currentUsers.Select(p => p.ConversationId).ToArray());

                if (!conversations.Any())
                {
                    return new List<ConversationViewModel>(0);
                }

                var conversationIds = conversations.Select(c => c.Id).ToArray();
                var usersFromOwnConversations = await this.GetConversationUsers(true, conversationIds);
                var usersByConversation = usersFromOwnConversations.GroupBy(u => u.ConversationId).ToDictionary(g => g.Key);

                if (includeGroups != true)
                {
                    usersByConversation = usersByConversation
                        .Where(t => t.Value.Count() == 2)
                        .ToDictionary(i => i.Key, i => i.Value);
                }

                var currentUsersIds = currentUsers.Select(x => x.Id).ToList();

                var messages = await _dbContext.ConversationMessages.Where(x => conversationIds.Contains(x.ConversationId))
                    .ToListAsync();

                messages = messages.Where(x => x.ToUsers.Contains(_currentUser.User.Id)).ToList();
                foreach (var conv in conversations)
                {
                    // исключаем чаты без участников
                    if (usersByConversation.ContainsKey(conv.Id) != true)
                    {
                        continue;
                    }

                    var users = usersByConversation[conv.Id];

                    var currentUser = usersByConversation[conv.Id].Single(u => u.UserId == userId);
                    var currentMessages = messages.Where(t => t.ConversationId == conv.Id).ToList();

                    var unreadMessages = currentMessages.Where(x => x.IsSilent != true && !currentUsersIds.Contains(x.OriginatorId) && x.SendDate >= currentUser.LastConversationViewDate).ToList();

                    result.Add(new ConversationViewModel
                    {
                        ReadOnly = !(currentUser.IsActive),
                        Entity = conv,
                        Users = users.ToList(),
                        LocalOriginatorId = currentUser.Id,
                        UnreadCount = unreadMessages.IsAny() ? unreadMessages.Count : 0,
                        LastActionDate = unreadMessages.Count > 0 ? unreadMessages.Max(p => p.SendDate) :
                            (currentMessages.Any() ? currentMessages.Max(p => p.SendDate) : currentUser.LastConversationViewDate)
                    });
                }
            }

            return result;
        }

        /// <summary>
        /// Получить список участников
        /// </summary>
        /// <param name="userDetails">добавить все информацию по пользователям</param>
        /// <param name="conversationIds">Id чата</param>
        /// <returns>Список участников</returns>
        public async Task<List<ConversationUser>> GetConversationUsers(bool userDetails = true, params int[] conversationIds)
        {
            var result = new List<ConversationUser>();
            if (conversationIds.Any() == false) return result;

            var conversationUsers = await _dbContext.ConversationUsers.Where(x => conversationIds.Contains(x.ConversationId))
                .ToListAsync();

            if (conversationUsers.IsAny())
            {
                if (userDetails)
                {
                    var aspUserIds = conversationUsers.Select(t => t.UserId).Distinct().ToList();

                    var aspUsers = _dbContext.Users.Where(x => aspUserIds.Contains(x.Id));
                    var onlineStatuses = _userConnections.CheckIfUsersOnline(aspUserIds);

                    foreach (var u in aspUsers)
                    {
                        foreach (var convUser in result.Where(t => t.UserId == u.Id))
                        {
                            convUser.IsOnline = onlineStatuses.Any(t => t == convUser.UserId);
                            convUser.UserName = u.UserName;
                        }
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Выставить дополнительные поля для участника чата
        /// </summary>
        /// <param name="convUser">Участник чата</param>
        /// <param name="ext">ГЦОУ/ЦОУ, подразделения, департаменты</param>
        /// <returns>Участник чата</returns>
        private ConversationUser SetConvUserOptionalFields(ConversationUser convUser, (List<string> codes, List<string> divisions, List<string> branches) ext)
        {
            return convUser;
        }

        /// <summary>
        /// Выставить дополнительные поля для участника чата
        /// </summary>
        /// <param name="convUser">Участник чата</param>
        /// <returns>Участник чата</returns>
        private ConversationUser SetConvUserOptionalFields(ConversationUser convUser)
        {
            convUser.IsOnline = _userConnections.CheckIfUserOnline(convUser.UserId);
            return convUser;
        }

        /// <summary>
        /// Создать чат или вернуть номер существующего
        /// </summary>
        /// <param name="userIds">Массив ID пользователей</param>
        /// <param name="orgIds">Массив ID организаций, из которых необходимо добавить людей в чат</param>
        /// <param name="entityId">Номер сущности</param>
        /// <param name="typeId">Тип сущности</param>
        /// <param name="connectionId">ID соединения</param>
        /// <param name="createConversation">Создать ли чат (по-умолчанию false)</param>
        /// <returns>Предварительная модель для создания чата</returns>
        public async Task<PreCreateConversationModel> CreateConversation(string[] userIds, int[] orgIds, long? entityId, int? typeId, string connectionId, ChatTypeEnum chatType = ChatTypeEnum.Any, bool createConversation = false)
        {
            int? convId = null;
            long? referenceId = null;
            long? eventId = null;
            string topic = string.Empty;

            if (entityId.HasValue && typeId == null)
            {
                throw new ArgumentNullException($"\"{nameof(typeId)}\" should be not null when \"{nameof(entityId)}\" exists");
            }

            if (entityId.HasValue)
            {
                switch (typeId.Value)
                {
                    case (int)ChatEntityType.Incident:
                        {
                            eventId = entityId.Value;
                            var entity = await _dbContext.Incidents.SingleAsync(x => x.Id == entityId);
                            var conversation = await this.GetConversationByReference(orgIds, null, eventId.Value, chatType);
                            if (conversation != null)
                            {
                                convId = conversation.Id;
                            }
                            else
                            {
                                topic = this.TopicName("Инцидент", entity.Title, entity.Id, chatType, orgIds);
                            }
                            break;
                        }
                    default:
                        throw new ArgumentNullException($"Value {typeId.Value.ToString()} of {nameof(typeId)} doesnt supported");
                }

                if (convId.HasValue)
                {
                    await this.AddUsersToConversation(convId.Value, connectionId, userIds);
                    return new PreCreateConversationModel
                    {
                        ConversationId = convId.Value
                    };
                }
            }
            else if (userIds.Count() == 2)
            {
                var privateConversationId = await TryGetPrivateConversation(userIds);
                if (privateConversationId != null)
                {
                    return new PreCreateConversationModel
                    {
                        ConversationId = privateConversationId
                    };
                }
            }
            //else if (userIds.Count() < 2)
            //{
            //	throw new InvalidOperationException("Нельзя создавать чат на 1 человека");
            //}

            if (createConversation)
            {
                var res = await this.CreateConversation(userIds, referenceId, eventId, typeId, topic, connectionId, chatType, true);
                return new PreCreateConversationModel
                {
                    ConversationId = res.EntityId
                };
            }
            else
            {
                var result = new PreCreateConversationModel
                {
                    EventsId = eventId,
                    ReferenceId = referenceId,
                    EventTypeId = typeId,
                    Topic = topic,
                    ChatType = chatType,
                    OrgId = (orgIds.IsAny() && orgIds.Length == 1) ? orgIds[0] : (int?)null,
                    IsGroup = typeId != null || userIds.Count() > 2
                };

                result.Users = userIds.Distinct()
                                .Where(p => p != _currentUser.User.Id)
                                .Select(x => _dbContext.Users.Single(u => u.Id == x))
                                .Select(p =>
                                {
                                    var userInfo = new ConversationUser
                                    {
                                        Name = p.FIO,
                                        UserId = p.Id,
                                        UserName = p.UserName,
                                        IsActive = true,
                                    };
                                    SetConvUserOptionalFields(userInfo);
                                    return userInfo;
                                }).ToList();
                if (!result.Users.IsAny())
                {
                    result.Users = new List<ConversationUser>()
                        {
                            new ConversationUser
                            {
                                Name = _currentUser.User.FIO,
                                UserId = _currentUser.User.Id,
                                IsActive = true,
                                IsOnline = _userConnections.CheckIfUserOnline(_currentUser.User.Id)
                            }
                        };
                }

                return result;
            }
        }

        private async Task<int?> TryGetPrivateConversation(string[] userIds)
        {
            var dataUsers = await _dbContext.ConversationUsers.Where(x => userIds.Contains(x.UserId) && x.IsActive)
                .ToListAsync();

            // если существует как минимум 2 участника чата, идем дальше
            if (dataUsers == null || dataUsers.Count < userIds.Length)
                return null;

            var conversationUsers = dataUsers.Cast<ConversationUser>();

            // находим чаты, в которых есть и 1й пользователь, и 2й
            var commonConversationIds = conversationUsers
                                            .Where(t => conversationUsers.Any(p => p.ConversationId == t.ConversationId && p.Id != t.Id))
                                            .Select(t => t.ConversationId)
                                            .Distinct();

            // если такие чаты есть, выбираем из них приватных. Если такой существует, возвращаем его
            if (commonConversationIds.Any())
            {
                var conversations = await this.GetConversationsByIds(commonConversationIds.ToArray());
                var privateConv = conversations.FirstOrDefault(t => t.IsGroup == false);

                return privateConv?.Id;
            }

            return null;
        }

        private string TopicName(string entity, string name, long rowId, ChatTypeEnum chatType, int[] orgIds)
        {
            var topic = $"{entity}/{(string.IsNullOrWhiteSpace(name) ? rowId.ToString() : name)}";
            if (chatType != ChatTypeEnum.Undefined)
            {
                switch (chatType)
                {
                    case ChatTypeEnum.Creators:
                        topic += "/подразделение создатель";
                        break;
                    case ChatTypeEnum.Editors:
                        topic += "/подразделение изменившее";
                        break;
                    case ChatTypeEnum.Any:
                        topic += "/все (подразделения создателя и изменившего)";
                        break;
                }

            }
            return topic;
        }

        /// <summary>
        /// Получить чат, привязанную к определенной сущности
        /// </summary>
        /// <param name="refId">ID сущности из таблицы Reference</param>
        /// <param name="eventId">ID сущности из таблицы Events</param>
        /// <returns>чат</returns>
        private async Task<Conversation> GetConversationByReference(int[] orgIds, long? refId, long? eventId = null, ChatTypeEnum chatType = ChatTypeEnum.Any)
        {
            if (refId == null && eventId == null)
            {
                throw new ArgumentNullException($"One of {nameof(refId)} or {nameof(eventId)} should be initialized");
            }

            var query = _dbContext.Conversations.Where(x => x.ChatType == (int)chatType);


            if (refId.HasValue)
            {
                query = query.Where(x => x.TopicEventId == refId);
            }
            else if (eventId.HasValue)
            {
                query = query.Where(x => x.TopicEventId == eventId);
            }

            var conversations = await query.ToListAsync();

            if (conversations.IsAny() && conversations.Count == 1)
            {
                return conversations.First();
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Создать чат
        /// </summary>
        /// <param name="userIds">Массив ID пользователей</param>
        /// <param name="referenceId">ID сущности, находящейся в таблице Reference</param>
        /// <param name="eventId">ID сущности, находящейся в таблице Events</param>
        /// <param name="eventTypeId">Тип сущности</param>
        /// <param name="topicName">Название чата</param>
        /// <param name="connectionId">ID соединения</param>
        /// <param name="notifyMe">Прислать экземпляр бесеы инициатору посредством SignalR</param>
        /// <returns>ServiceActionResult</returns>
        public async Task<ServiceActionResult> CreateConversation(string[] userIds, long? referenceId, long? eventId, int? eventTypeId,
            string topicName, string connectionId, ChatTypeEnum chatType, bool notifyMe = false)
        {
            var result = ServiceActionResult.GetFailed();

            userIds = userIds.Distinct().ToArray();

            var infos = _dbContext.Users.Where(x => userIds.Contains(x.Id)).ToArray();

            var currentUserId = _currentUser.User.Id;
            var isPrivateConversation = userIds.Length == 2 && referenceId == null && eventId == null;

            if (isPrivateConversation)
            {
                var privateConversationId = await TryGetPrivateConversation(userIds);
                if (privateConversationId != null)
                {
                    var conversation = await GetConversationViewModelById(privateConversationId.Value);
                    if (conversation != null)
                    {
                        return ServiceActionResult.GetSuccess(entityId: privateConversationId, entity: conversation);
                    }
                }
            }

            var newConversation = new Conversation
            {
                CustomName = topicName,
                TopicEventId = eventId,
                TopicRefId = referenceId,
                IsGroup = userIds.Length > 2 || referenceId.HasValue || eventId.HasValue,
                EntityEventTypeId = eventTypeId,
                IsActive = isPrivateConversation,
                ChatType = (int)chatType,
            };

            _dbContext.Conversations.Add(newConversation);
            await _dbContext.SaveChangesAsync();

            var newConvUsers = infos
                .Select(i => new ConversationUser
                {
                    IsActive = true,
                    IsAdmin = i.Id == currentUserId || isPrivateConversation,
                    ConversationId = newConversation.Id,
                    IsStarter = i.Id == currentUserId,
                    LastConversationViewDate = DateTimeOffset.Now,
                    Name = i.FIO,
                    UserName = i.UserName,
                    UserId = i.Id
                })
                .ToList();
            _dbContext.ConversationUsers.AddRange(newConvUsers);
            await _dbContext.SaveChangesAsync();

            for (var i = 0; i < newConvUsers.Count; i++)
            {
                this.SetConvUserOptionalFields(newConvUsers[i]);
            }

            var conversationVm = new ConversationViewModel
            {
                Users = newConvUsers,
                Entity = newConversation,
                LastActionDate = DateTimeOffset.Now,
                UnreadCount = 0,
                ReadOnly = false
            };

            await this.NotifyConversationChanged(conversationVm, notifyMe ? null : connectionId);
            var currentUser = _currentUser.User;
            var currentConversationUser = newConvUsers.FirstOrDefault(t => t.UserId == currentUser.Id);
            var startMessage = $"{currentUser.FIO} создал чат";
            await CreateEmergency(startMessage,
                currentConversationUser.Id, newConversation.Id, connectionId, isSilent: true, ignoreOnClient: true);
            conversationVm.EmergencyMessage = startMessage;
            conversationVm.LocalOriginatorId = currentConversationUser.Id;
            result = ServiceActionResult.GetSuccess(entityId: newConversation.Id, entity: conversationVm);

            return result;
        }

        /// <summary>
        /// Изменить название чата
        /// </summary>
        /// <param name="conversationId">ID чата</param>
        /// <param name="name">Новое название</param>
        /// <param name="connectionId">ID соединения</param>
        /// <returns>Произошло ли изменение названия</returns>
        public async Task<bool> ChangeConversationName(int conversationId, string name, string connectionId)
        {
            var currentUser = _currentUser.User;

            var conversation = await this.GetConversationById(conversationId);
            conversation.CustomName = name?.Trim();
            _dbContext.Conversations.Update(conversation);
            await _dbContext.SaveChangesAsync();

            var users = await this.GetConversationUsers(false, conversationId);
            var currentConversationUser = users.FirstOrDefault(t => t.UserId == currentUser.Id);

            await this.CreateEmergency($"Участник {currentUser.FIO} изменил название чата на \"{name}\"",
                    currentConversationUser.Id, conversationId, connectionId);

            await this.NotifyConversationChanged(new ConversationViewModel
            {
                Entity = conversation
            }, null);

            return true;
        }

        /// <summary>
        /// Добавить новых пользователей в чат
        /// </summary>
        /// <param name="conversationId">ID чата</param>
        /// <param name="connectionId">ID соединения</param>
        /// <param name="userIds">Массив ID участников</param>
        /// <returns>Список новых участников чата</returns>
        public async Task<List<ConversationUser>> AddUsersToConversation(int conversationId, string connectionId, params string[] userIds)
        {
            var newConvUsers = new List<ConversationUser>();

            var currentUser = _currentUser.User;

            var users = await this.GetConversationUsers(true, conversationId);

            var aspUsers = await _dbContext.Users.Where(x => userIds.Contains(x.Id)).ToListAsync();

            var userToCreateIds = userIds.Except(users.Select(p => p.UserId)).ToList();
            var usersToChangeStatus = users.Where(p => p.IsActive == false && userIds.Any(t => t == p.UserId)).ToList();

            if (usersToChangeStatus.Count > 0)
            {
                foreach (var item in usersToChangeStatus)
                {
                    item.IsActive = true;
                }
            }

            if (userToCreateIds.Count > 0)
            {
                newConvUsers.AddRange(
                    aspUsers
                    .Where(p => userToCreateIds.Any(t => t == p.Id))
                    .Select(i => new ConversationUser
                    {
                        IsActive = true,
                        ConversationId = conversationId,
                        IsStarter = false,
                        IsAdmin = false,
                        LastConversationViewDate = DateTimeOffset.Now,
                        Name = i.FIO,
                        UserId = i.Id
                    }));
            }

            _dbContext.ConversationUsers.UpdateRange(usersToChangeStatus);
            _dbContext.ConversationUsers.AddRange(newConvUsers);
            await _dbContext.SaveChangesAsync();

            var conversation = await this.GetConversationById(conversationId);
            if (conversation.IsGroup != true && string.IsNullOrEmpty(conversation.CustomName))
                conversation.CustomName = "Групповой чат";
            conversation.IsGroup = true;

            _dbContext.Conversations.Update(conversation);
            await _dbContext.SaveChangesAsync();

            await this.NotifyConversationChanged(conversationId, null); //до отправки сообщения, чтобы на клиенте добавился чат и служебное сообщение зассчиталось в счетчик не прочитанных
            var currentConversationUser = users.FirstOrDefault(t => t.UserId == currentUser.Id);
            if (currentConversationUser == null)
            {
                currentConversationUser = newConvUsers.FirstOrDefault(x => x.UserId == currentUser.Id);
            }
            var currentConversationUserId = currentConversationUser?.Id ?? 0;
            for (int i = 0; i < newConvUsers.Count; i++)
            {
                await this.CreateEmergency($"{currentUser.FIO} добавил { newConvUsers[i].Name} в текущий чат", currentConversationUserId,
                    conversationId, connectionId);
            }
            await this.UpdateConversationUserViewDate(currentConversationUserId, connectionId);


            return newConvUsers;
        }

        /// <summary>
        /// Изменить специальные права у участника чата
        /// </summary>
        /// <param name="conversationUserId">ID участника чата</param>
        /// <param name="isAdmin">Сделать ли пользователя админом</param>
        /// <param name="connectionId">ID соединения</param>
        /// <returns>Выполнилась ли операция</returns>
        public async Task<bool> EditPermissions(int conversationUserId, bool isAdmin, string connectionId)
        {

            var user = await _dbContext.ConversationUsers.SingleAsync(x => x.Id == conversationUserId);

            if (user.IsStarter)
            {
                throw new InvalidOperationException("Запрещается выставлять права для создателя чата");
            }

            user.IsAdmin = isAdmin;

            _dbContext.ConversationUsers.Update(user);
            await _dbContext.SaveChangesAsync();

            await this.NotifyConversationChanged(user.ConversationId, null);

            return true;
        }

        /// <summary>
        /// Удалить пользователя из чата
        /// </summary>
        /// <param name="conversationUserId">ID участника чата</param>
        /// <param name="connectionId">ID соединения</param>
        /// <returns>Выполнилась ли операция</returns>
        public async Task<bool> RemoveUserFromConversation(int conversationUserId, string connectionId)
        {
            var currentUser = _currentUser.User;

            var conversationUser = await _dbContext.ConversationUsers.SingleAsync(x => x.Id == conversationUserId);

            if (conversationUser.IsStarter)
            {
                throw new InvalidOperationException("Невозможно исключить создателя чата");
            }

            conversationUser.IsActive = false;
            conversationUser.IsAdmin = false;

            _dbContext.ConversationUsers.Update(conversationUser);
            await _dbContext.SaveChangesAsync();

            var conversation = await this.GetConversationViewModelById(conversationUser.ConversationId);
            var currentConversationUserId = conversation.Users.FirstOrDefault(t => t.UserId == currentUser.Id).Id;

            await this.CreateEmergency($"{currentUser.FIO} исключил {conversationUser.Name} из чата",
                    currentConversationUserId, conversationUser.ConversationId, connectionId, conversationUser.UserId);
            await this.UpdateConversationUserViewDate(currentConversationUserId, connectionId);
            await this.NotifyConversationChanged(conversationUser.ConversationId, null);

            return true;
        }

        /// <summary>
        /// Отправить служебное уведомление
        /// </summary>
        /// <param name="text">Текст уведомления</param>
        /// <param name="originatorId">Инициатор (пользователь чата)</param>
        /// <param name="conversationId">Номер чата</param>
        /// <param name="connectionId"></param>
        /// <param name="forUser">идентификаторы пользователей - получателей сообщения</param>
        /// <param name="isSilent">не учитывать в счетчиках непрочитанных сообщений</param>
        /// <param name="ignoreOnClient">игнорировать на клиенте из которого инициировано отправление</param>
        /// <returns></returns>
        private async Task CreateEmergency(string text, int originatorId, int conversationId, string connectionId, string forUser = null, bool isSilent = false, bool ignoreOnClient = false)
        {

            var bp = new ConversationMessage
            {
                IsEmergency = true,
                IsSilent = isSilent,
                Text = text,
                ConversationId = conversationId,
                OriginatorId = originatorId,
                SendDate = DateTimeOffset.Now,
                ToUsers = !string.IsNullOrEmpty(forUser) ? new[] { forUser } : null
            };

            await this.Send(bp, null, connectionId, !ignoreOnClient);
        }

        /// <summary>
        /// Записать в ПОС новое сообщение
        /// </summary>
        /// <param name="message">Сообщение</param>
        /// <param name="newFiles">Прикрепленные файлы</param>
        /// <param name="connectionId">ID соединения</param>
        /// <param name="notifyMe">Отправить созданное сообщение инициатору посредством SignalR (по-умолчанию false)</param>
        /// <returns>ServiceActionResult</returns>
        public async Task<ServiceActionResult> Send(ConversationMessage message, List<IFormFile> newFiles, string connectionId, bool notifyMe = false)
        {
            var statuses = new List<ConversationMessageStatus>();
            var CurrentUserId = _currentUser.User.Id;
            try
            {
                if (message.OriginatorId <= 0)
                {
                    return ServiceActionResult.GetFailed("Не указан отправитель сообщения");
                }

                if (message.ConversationId <= 0)
                {
                    return ServiceActionResult.GetFailed("Не указан номер чата");
                }

                message.Text = message.Text?.Trim();

                var users = await GetConversationUsers(true, message.ConversationId);
                if (users.All(p => p.UserId != CurrentUserId))
                {
                    return ServiceActionResult.GetFailed("Отправитель не соответствует текущему");
                }
                if (users.All(p => p.UserId != CurrentUserId || !(p.IsActive)))
                {
                    return ServiceActionResult.GetFailed("Вы были исключены из чата");
                }

                var conversation = await GetConversationById(message.ConversationId);
                if (!(conversation.IsActive) && !(message.IsEmergency))
                {
                    conversation.IsActive = true;
                    _dbContext.Conversations.Update(conversation);
                    await _dbContext.SaveChangesAsync();
                    await this.NotifyConversationChanged(new ConversationViewModel
                    {
                        Entity = conversation
                    }, null);
                }

                message.SendDate = DateTimeOffset.Now;
                var toUsers = (message.ToUsers ?? new string[] { }).ToList();
                toUsers.AddRange(users.Where(x => (x.IsActive) && !string.IsNullOrEmpty(x.UserId)).Select(x => x.UserId));
                message.ToUsers = toUsers.Distinct().ToArray();


                _dbContext.ConversationMessages.Add(message);
                await _dbContext.SaveChangesAsync();

                int? fileId = null;
                if (newFiles != null && newFiles.Any())
                {
                    await _fileService.Store(message.Id, typeof(ConversationMessage).Name.ToLower(), newFiles);
                    var file = (await _fileService.GetFiles(message.Id, typeof(ConversationMessage).Name.ToLower()))[0];
                    fileId = file.Id;
                }


                var receivers = users.Where(p => p.UserId != CurrentUserId).ToList();
                var notif = new MessageViewModel
                {
                    Body = message,
                    User = users.Single(p => p.UserId == CurrentUserId),
                    ToUsers = receivers.Where(x => !string.IsNullOrEmpty(x.UserId)).Select(x => x.UserId).ToList()
                };

                if (newFiles.IsAny())
                {
                    notif.Attachments.Add(new AttachmentViewModel
                    {
                        Id = fileId.Value,
                        Name = newFiles[0].Name
                    });
                }

                await UpdateConversationUserViewDate(message.OriginatorId, connectionId);
                await this.NotifyNewMessage(notif, notifyMe ? null : connectionId);
                // сделать статус "доставлено" для онлайн пользователей

                foreach (var user in receivers)
                {
                    var isActive = _userConnections.CheckIfUserOnline(user.UserId);
                    if (isActive)
                    {
                        statuses.AddRange((await this.SetMessageStatus(new int[] { message.Id }, user.Id, user.UserId, message.ConversationId, connectionId, MessageStatus.Delivered))
                            .Entity as List<ConversationMessageStatus>);
                    }
                }

                return new ServiceActionResult()
                {
                    Success = true,
                    EntityId = message.Id,
                    Entity = new
                    {
                        Status = statuses.Count > 0 ? statuses.Max(t => t.GetStatus()) : null
                    }
                };
            }
            catch (Exception ex)
            {
                return ServiceActionResult.GetFailed("Сообщение не может быть отправлено: " + ex.Message);
            }
        }

        /// <summary>
        /// Выставить статусы по следующим сообщениям
        /// </summary>
        /// <param name="messageIds">id сообщений</param>
        /// <param name="userId">id пользователя участника чата</param>
        /// <param name="conversationId">id чата</param>
        /// <param name="conversationUserId">id участинка чата</param>
        /// <param name="connection"></param>
        /// <param name="status">конечный статус</param>
        /// <returns>ServiceActionResult</returns>
        public async Task<ServiceActionResult> SetMessageStatus(int[] messageIds, int conversationUserId, string userId, int conversationId, string connection, MessageStatus status = MessageStatus.Seen)
        {
            if (messageIds.Any() == false)
            {
                return new ServiceActionResult
                {
                    Success = false,
                    Message = "No messages set"
                };
            }

            var existedMessageStatuses = await _dbContext.ConversationMessageStatuses
                .Where(x => x.ConversationUserId == conversationId && messageIds.Contains(x.MessageId))
                .ToListAsync();

            foreach (var item in existedMessageStatuses)
            {
                item.ConversationId = conversationId;
            }

            var messageStatusesToModify = new List<ConversationMessageStatus>();
            var messagesWithoutStatusIds = messageIds.Except(existedMessageStatuses.Select(t => t.MessageId));
            foreach (var messageId in messagesWithoutStatusIds)
            {
                var _item = new ConversationMessageStatus
                {
                    ConversationId = conversationId,
                    ConversationUserId = conversationUserId,
                    UserId = userId,
                    MessageId = messageId
                };
                _item.SetStatus(status);
                messageStatusesToModify.Add(_item);
            }

            var messageStatuesToUpdate = new List<ConversationMessageStatus>();
            foreach (var item in existedMessageStatuses.Where(p => p.GetStatus() != status))
            {
                item.SendDate = DateTimeOffset.Now;
                item.SetStatus(status);
                messageStatuesToUpdate.Add(item);
            }

            _dbContext.ConversationMessageStatuses.AddRange(messageStatusesToModify);
            _dbContext.ConversationMessageStatuses.UpdateRange(messageStatuesToUpdate);
            await _dbContext.SaveChangesAsync();

            for (int i = 0; i < messageStatusesToModify.Count; i++)
            {
                var messageStatus = messageStatusesToModify[i];
                messageStatus.ConversationId = conversationId;
                await this.NotifyMessageStatusUpdated(messageStatus, connection);
            }

            if (status == MessageStatus.Seen)
            {
                await UpdateConversationUserViewDate(conversationUserId, connection);
            }

            var actionResult = new ServiceActionResult
            {
                Success = true,
                Entity = messageStatusesToModify
            };

            return actionResult;
        }

        /// <summary>
        /// Выставить статус Delivery для всех непрочитанных сообщений для текущего пользователя (вызывается в момент аутентификации пользователя)
        /// </summary>
        /// <param name="connectionId">ID соединения</param>
        /// <returns></returns>
        public async Task DeliveryMessagesForCurrentUser(string connectionId, string userId)
        {
            var convUsers = await _dbContext.ConversationUsers.Where(x => x.UserId == userId).ToListAsync();
            if (!convUsers.IsAny())
            {
                return;
            }

            var conversationIds = convUsers.Select(t => t.ConversationId).ToArray();
            var conversations = await _dbContext.Conversations.Where(x => conversationIds.Contains(x.Id)).ToListAsync();

            if (conversations.IsAny() && convUsers.IsAny())
            {
                var conversationUserIds = convUsers.Select(x => x.Id);
                var convIds = conversations.Select(t => t.Id);

                var messages = await _dbContext.ConversationMessages
                    .Where(x => convIds.Contains(x.ConversationId) &&
                                !conversationUserIds.Contains(x.OriginatorId))
                    .ToListAsync();

                messages = messages.Where(x => x.ToUsers.Contains(userId)).ToList();

                foreach (var conversation in conversations)
                {
                    var user = convUsers.FirstOrDefault(t => t.ConversationId == conversation.Id);
                    var newMessages = messages.Where(t => t.ConversationId == conversation.Id && 
                                                          t.SendDate >= user.LastConversationViewDate).ToList();
                    if (newMessages.Any())
                    {
                        await SetMessageStatus(newMessages.Select(t => t.Id).ToArray(), 
                            user.Id, user.UserId, conversation.Id, connectionId, MessageStatus.Delivered);
                    }
                }
            }
        }

        /// <summary>
        /// Обновить у пользователя дату послденего взаимодействия с чатом
        /// </summary>
        /// <param name="convUserId"> ID участника чата</param>
        /// <param name="connectionId">ID соединения</param>
        /// <returns>ReceiveBasePointResult</returns>
        public async Task UpdateConversationUserViewDate(int convUserId, string connectionId)
        {
            var convUser = await _dbContext.ConversationUsers.SingleAsync(x => x.Id == convUserId);
            convUser.LastConversationViewDate = DateTimeOffset.Now;
            _dbContext.ConversationUsers.Update(convUser);
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Отправить подписчикам уведомление об обновлении параметров чата
        /// </summary>
        /// <param name="conversationId">ID чата</param>
        /// <param name="connectionId">ID соединения</param>
        /// <returns></returns>
        private async Task NotifyConversationChanged(int conversationId, string connectionId)
        {
            var conversation = await this.GetConversationViewModelById(conversationId);
            await this.NotifyConversationChanged(conversation, connectionId);
        }

        /// <summary>
        /// Отправить подписчикам уведомление об обновлении параметров чата
        /// </summary>
        /// <param name="conversation">Экзмепляр чата</param>
        /// <param name="connectionId">ID соединения</param>
        private async Task NotifyConversationChanged(ConversationViewModel conversation, string connectionId)
        {
            var serialized = JsonConvert.SerializeObject(conversation);

            await MainNotification(NotificationType.ConversationUpdate, serialized, conversation.Entity.Id, connectionId);
        }

        /// <summary>
        /// Отправить подписчикам уведомление об изменении статуса сообщения
        /// </summary>
        /// <param name="status">Экземпляр статуса сообщения</param>
        /// <param name="connectionId">ID соединения</param>
        private async Task NotifyMessageStatusUpdated(ConversationMessageStatus status, string connectionId)
        {
            var serialized = JsonConvert.SerializeObject(status);

            await MainNotification(NotificationType.MessageStatusUpdate, serialized, status.ConversationId, connectionId);
        }

        /// <summary>
        /// Отправить подписчикам уведомления об новом сообщении
        /// </summary>
        /// <param name="message">Экзепляр сообщения</param>
        /// <param name="connectionId">ID соединения</param>
        public async Task NotifyNewMessage(MessageViewModel message, string connectionId)
        {
            var serialized = JsonConvert.SerializeObject(message);

            await MainNotification(NotificationType.NewMessage, serialized, message.Body.ConversationId, connectionId);
        }

        private async Task MainNotification(NotificationType notificationType, string data, int? conversationId, string connectionId)
        {
            var messengerNotification = new MessengerNotification()
            {
                NotificationType = notificationType.ToString(),
                NotificationData = data,
                ParentId = conversationId
            };

            //TODO доедалать оповещения
            throw new NotImplementedException();
        }

        /// <summary>
        /// Получить количество непрочитанных сообщений
        /// </summary>
        /// <returns></returns>
        public async Task<int> GetUnreadCount()
        {
            var currentUserConvUsers = await _dbContext.ConversationUsers.Where(x => x.UserId == _currentUser.User.Id)
                .ToListAsync();
            if (!currentUserConvUsers.IsAny())
                return 0;

            var conversationIds = currentUserConvUsers.Select(c => c.ConversationId);
            var inactiveConversationIds = await _dbContext.Conversations
                .Where(x => !x.IsActive && conversationIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync();

            var convUserIds = currentUserConvUsers.Select(x => x.Id);

            var convIds = currentUserConvUsers.Where(x => !inactiveConversationIds.Contains(x.ConversationId)).Select(c => c.ConversationId);

            var messages = await _dbContext.ConversationMessages.Where(x =>
                    !x.IsSilent && convIds.Contains(x.ConversationId)
                                && convUserIds.Contains(x.OriginatorId))
                .ToListAsync();

            messages = messages.Where(x => x.ToUsers.Contains(_currentUser.User.Id)).ToList();
            return messages.Count(x => x.SendDate >= (currentUserConvUsers.Single(c => c.ConversationId == x.ConversationId).LastConversationViewDate));
        }
    }

    public class MessengerNotification
    {
        /* public DateTimeOffset? InsDate { get; set; } // Дата создания - obj.InsDate */
        /// <summary>Данные оповещения - obj.Description</summary>
        public string NotificationData { get; set; }

        /// <summary>Тип оповещения - obj.Str0</summary>
        public string NotificationType { get; set; }

        /// <summary>Основание для оповещения (сущность Reference) - obj.ReferenceId</summary>
        public long? NotifyRefId { get; set; }
        public int? ParentId { get; set; } // Id чата - obj.ParentId 
    }

    public enum ChatEntityType
    {
        Incident
    }
}