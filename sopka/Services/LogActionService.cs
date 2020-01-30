using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using sopka.Controllers;
using sopka.Helpers;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.Enum;
using sopka.Models.Filters;

namespace sopka.Services
{
    public class LogActionService
    {
        private readonly SopkaDbContext _dbContext;
        private readonly CurrentUser _currentUser;

        public LogActionService(SopkaDbContext dbContext, CurrentUser currentUser)
        {
            _dbContext = dbContext;
            _currentUser = currentUser;
        }

        public async Task<LogActionDictionaries> GetDictionaries()
        {
            return new LogActionDictionaries()
            {
                Users = await _dbContext.Users
                    .WhereCompany(_currentUser.User.CompanyId)
                    .Select(x => new DictionaryItem<string, string>(x.Id, x.FIO))
                    .ToListAsync(),
                Actions = EnumHelperX<LogActions>.GetValues()
                    .Select(x => new DictionaryItem<string, string>(x.GetName(), x.GetDescription()))
                    .ToList(),
                ActionTypes = new List<DictionaryItem<bool, string>>()
                {
                    new DictionaryItem<bool, string>(true, "Изменение"),
                    new DictionaryItem<bool, string>(false, "Просмотр"),
                },
                EntityTypes = EnumHelperX<ActionEntityType>.GetValues()
                    .Select(x => new DictionaryItem<ActionEntityType, string>(x, x.GetDescription()))
                    .ToList(),
            };
        }

        public async Task<PaginationModel<LogActionListItem>> GetLogs(LogActionFilter filter)
        {
            var query = _dbContext.LogAction
                .WhereCompany(_currentUser.User.CompanyId)
                .AsQueryable();
            if (filter.Date.HasValue)
            {
                var from = filter.Date.Value.Date.Date;
                var to = from.AddDays(1);
                query = query.Where(x => x.Date >= from && x.Date < to);
            }
            else if (filter.UsePeriod)
            {
                query = query.Where(x => x.Date <= filter.DateTo && x.Date >= filter.DateFrom);
            }
            if (!string.IsNullOrEmpty(filter.ActionName))
            {
                query = query.Where(x => x.ActionName == filter.ActionName);
            }
            if (filter.SessionId.HasValue)
            {
                query = query.Where(x => x.SessionId == filter.SessionId);
            }
            if (!string.IsNullOrEmpty(filter.UserId))
            {
                query = query.Where(x => x.UserId == filter.UserId);
            }
            if (filter.EntityType.HasValue)
            {
                query = query.Where(x => x.EntityType == filter.EntityType);
            }
            if (filter.IsMainAction.HasValue)
            {
                query = query.Where(x => x.IsMainAction == filter.IsMainAction);
            }

            IQueryable<LogAction> dataQuery;

            switch (filter.SortColumn)
            {
                case nameof(LogActionListItem.Date):
                    dataQuery = filter.SortDirection == Direction.Asc
                        ? query.OrderBy(x => x.Date)
                        : query.OrderByDescending(x => x.Date);
                    break;
                case nameof(LogActionListItem.ActionTitle):
                    dataQuery = filter.SortDirection == Direction.Asc
                        ? query.OrderBy(x => x.ActionName)
                        : query.OrderByDescending(x => x.ActionName);
                    break;
                case nameof(LogActionListItem.ActionType):
                    dataQuery = filter.SortDirection == Direction.Asc
                        ? query.OrderBy(x => x.IsMainAction)
                        : query.OrderByDescending(x => x.IsMainAction);
                    break;
                case nameof(LogActionListItem.SessionId):
                    dataQuery = filter.SortDirection == Direction.Asc
                        ? query.OrderBy(x => x.SessionId)
                        : query.OrderByDescending(x => x.SessionId);
                    break;
                case nameof(LogActionListItem.Entity):
                    dataQuery = filter.SortDirection == Direction.Asc
                        ? query.OrderBy(x => x.EntityType)
                        : query.OrderByDescending(x => x.EntityType);
                    break;
                case nameof(LogActionListItem.UserInfo):
                    dataQuery = filter.SortDirection == Direction.Asc
                        ? query.OrderBy(x => x.UserId)
                        : query.OrderByDescending(x => x.UserId);
                    break;
                case nameof(LogActionListItem.Id):
                default:
                    dataQuery = filter.SortDirection == Direction.Asc
                        ? query.OrderBy(x => x.Id)
                        : query.OrderByDescending(x => x.Id);
                    break;

            }

            var logs = dataQuery.Skip(filter.Skip).Take(filter.ItemsPerPage);
            var count = query.Count();

            var logList = logs.Select(x => new LogActionListItem()
            {
                Action = x.ActionName,
                ActionTitle =
                    EnumHelperX<LogActions>.GetDescription(EnumHelperX<LogActions>.GetValueFromName(x.ActionName)),
                Date = x.Date,
                UserId = x.UserId,
                UserInfo = x.UserName,
                ActionType = x.IsMainAction ? "Изменение" : "Просмотр",
                IsMainAction = x.IsMainAction,
                Entity =
                    x.EntityType.HasValue ? EnumHelperX<ActionEntityType>.GetDescription(x.EntityType.Value) : null,
                EntityTitle = x.EntityTitle,
                EntityId = x.EntityId,
                EntityUrl = GetEntityUrl(x),
                Parameters = x.Parameters,
                SessionId = x.SessionId,
                Id = x.Id,
                Ip = x.Ip,
                Headers = x.Headers
            }).ToList();

            return new PaginationModel<LogActionListItem>()
            {
                Items = logList,
                Total = count
            };
        }

        private string GetEntityUrl(LogAction logAction)
        {
            if (!logAction.EntityType.HasValue)
            {
                return string.Empty;
            }
            switch (logAction.EntityType.Value)
            {
                case ActionEntityType.DictionaryAttackTypes:
                case ActionEntityType.DictionaryBranches:
                case ActionEntityType.DictionaryEquipmentTypes:
                case ActionEntityType.DictionaryObjects:
                case ActionEntityType.DictionaryCPU:
                case ActionEntityType.DictionaryHDD:
                case ActionEntityType.DictionaryNetworkAdapters:
                case ActionEntityType.DictionaryOS:
                case ActionEntityType.DictionaryPlatforms:
                case ActionEntityType.DictionaryRAM:
                case ActionEntityType.DictionaryRaid:
                case ActionEntityType.DictionarySoftware:
                    return "/Dictionaries";
                case ActionEntityType.User:
                    return $"/Users?UserId={logAction.EntityId}";
                case ActionEntityType.Article:
                    return $"/KnowledgeBase/{logAction.EntityId}";
                case ActionEntityType.ArticleFolder:
                    return $"/KnowledgeBase";
                case ActionEntityType.Equipment:
                    return $"/Equipment/{logAction.EntityId}";
                case ActionEntityType.Inventory:
                    return $"/Inventory/{logAction.EntityId}";
                case ActionEntityType.Incident:
                    return $"/Incident/{logAction.EntityId}";
                case ActionEntityType.EquipmentLog:
                    return $"/EquipmentLogs/{logAction.EntityId}";
                default:
                    return string.Empty;
            }
        }
    }

    public class LogActionDictionaries 
    {
        public List<DictionaryItem<string, string>> Users { get; set; }

        public List<DictionaryItem<string, string>> Actions { get; set; }

        public List<DictionaryItem<bool, string>> ActionTypes { get; set; }

        public List<DictionaryItem<ActionEntityType, string>> EntityTypes { get; set; }
    }

    public class LogActionListItem
    {
        public long Id { get; set; }

        public DateTimeOffset Date { get; set; }

        public string Action { get; set; }

        public string ActionTitle { get; set; }

        public string ActionType { get; set; }

        public bool IsMainAction { get; set; }

        public string Entity { get; set; }

        public string UserId { get; set; }

        public string UserInfo { get; set; }

        public string Parameters { get; set; }

        public int? SessionId { get; set; }

        public string EntityTitle { get; set; }

        public string EntityId { get; set; }

        public string EntityUrl { get; set; }

        public string Ip { get; set; }

        public string Headers { get; set; }
    }
}