using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using sopka.Controllers;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Models.ViewModels;

namespace sopka.Services
{
    public class IncidentService
    {
        private readonly SopkaDbContext _dbContext;
        private readonly FileService _fileService;
        private readonly CurrentUser _currentUser;
        private readonly AccessControlService _accessControlService;

        public IncidentService(SopkaDbContext dbContext, FileService fileService, CurrentUser currentUser, AccessControlService accessControlService)
        {
            _dbContext = dbContext;
            _fileService = fileService;
            _currentUser = currentUser;
            _accessControlService = accessControlService;
        }

        public async Task<(IEnumerable<IncidentListItem>, int)> GetIncidents(IncidentFilter filter)
        {
            var query = _dbContext.Incidents
                .WhereCompany(_currentUser.User.CompanyId)
                .Include(x => x.Status)
                .AsQueryable();

            if (filter.Id.HasValue) query = query.Where(x => x.Id == filter.Id.Value);
            if (string.IsNullOrEmpty(filter.Title) == false) query = query.Where(x => x.Title.StartsWith(filter.Title));
            if (filter.AttackType.HasValue) query = query.Where(x => x.AttackType == filter.AttackType.Value);
            if (filter.FixationTime.HasValue) query = query.Where(x => x.CreateDate == filter.FixationTime.Value);
            if (filter.Status.HasValue) query = query.Where(x => x.IdStatus == filter.Status.Value);
            if (string.IsNullOrEmpty(filter.ResponsibleRoleId) == false) query = query.Where(x => x.ResponsibleUserId == filter.ResponsibleRoleId);
            if (string.IsNullOrEmpty(filter.CreatorId) == false) query = query.Where(x => x.CreatorUserId == filter.CreatorId);
            if (filter.ObjectId.HasValue) query = query.Where(x => x.SourceEquipment.IdObject == filter.ObjectId);
            if (filter.EquipmentId.HasValue) query = query.Where(x => x.SourceEquipmentId == filter.EquipmentId);
            if (filter.PlatformId.HasValue) query = query.Where(x => x.SourceEquipment.Platform == filter.PlatformId);
            if (string.IsNullOrEmpty(filter.Country) == false)
                query = query.Where(x => x.SourceCountry.StartsWith(filter.Country, StringComparison.InvariantCultureIgnoreCase));
            if (string.IsNullOrEmpty(filter.SourceIP) == false)
                query = query.Where(x => x.SourceIP.StartsWith(filter.SourceIP, StringComparison.CurrentCultureIgnoreCase));
            if (!(filter.ShowClosed.HasValue && filter.ShowClosed.Value))
            {
                query = query.Where(x => x.Status != null && x.Status.Name != "Закрыт");
            }

            var count = await query.CountAsync();
            if (filter.SortDirection == Direction.Asc)
                query = query.OrderBy(GetOrderBy(filter.SortColumn));
            else
                query = query.OrderByDescending(GetOrderBy(filter.SortColumn));

            var skip = (filter.Page - 1) * filter.ItemsPerPage;
            if (skip < 0) skip = 0;

            var set = await query
                .Skip(skip)
                .Take(filter.ItemsPerPage)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.FixationTime,
                    x.AttackType,
                    AttackTypeName = x.AttackDirectory.Title,
                    x.SourceCountry,
                    x.SourceIP,
                    StatusName = x.Status.Name
                })
                .ToListAsync();

            var result = set.Select(x => new IncidentListItem()
            {
                Id = x.Id,
                Title = x.Title,
                FixationTime = x.FixationTime,
                AttackType = x.AttackType,
                AttackTypeName = x.AttackTypeName,
                SourceCountry = x.SourceCountry,
                SourceIP = x.SourceIP,
                StatusName = x.StatusName
            });


            return (result, count);
        }

        private Expression<Func<Incident, object>> GetOrderBy(string column)
        {
            switch (column)
            {
                case "AttackType": 
                    return x => x.AttackType;
                case "Status":
                    return x => x.IdStatus;
                case "SourceIP":
                    return x => x.SourceIP;
                case "SourceCountry":
                    return x => x.SourceCountry;
                case "FixationTime":
                    return x => x.FixationTime;
                default: return x => x.Id;
            }
        }

        public async Task<IncidentDictionariesViewModel> GetIncidentListDictionaries()
        {
            var viewModel = new IncidentDictionariesViewModel()
            {
                Attacks = await _dbContext.AttackDirectory.Select(x => new DictionaryItem<string>(x.Id, x.Title))
                    .ToListAsync(),
                Equipments = await _dbContext.Equipment
                    .WhereCompany(_currentUser.User.CompanyId)
                    .Select(x => new DictionaryItem<string>(x.Id, x.Name))
                    .ToListAsync(),
                Objects = await _dbContext.Objects
                    .WhereCompany(_currentUser.User.CompanyId)
                    .Select(x => new DictionaryDataItem<string, string>(x.Id, x.ObjectName, x.ObjectAddress))
                    .ToListAsync(),
                Platforms = await _dbContext.PlatformDirectory.Select(x => new DictionaryItem<string>(x.Id, x.Manufacturer + " " + x.Product))
                    .ToListAsync(),
                Users = await _dbContext.Users
                    .WhereCompany(_currentUser.User.CompanyId)
                    .Select(x => new DictionaryItem<string, string>(x.Id, x.FIO)).ToListAsync(),
                Roles = await _dbContext.Roles.Select(x => new DictionaryItem<string, string>(x.Id, x.Name)).ToListAsync(),
				Countries = await _dbContext.Incidents
                    .WhereCompany(_currentUser.User.CompanyId)
                    .Where(x => x.SourceCountry != null)
                    .Select(x => new DictionaryItem<string, string>(x.SourceCountry, x.SourceCountry)).Distinct().ToListAsync(),
                Severity = await _dbContext.IncidentCriticality
                    .Select(x => new DictionaryItem<string>(x.Id, x.Criticality)).ToListAsync()
            };

            return viewModel;
        }

        public async Task<IncidentCreationDictionariesViewModel> GetIncidentCreationDictionaries()
        {
            var equipmentListParams = new {objectId = (int?) null, skip = 0, take = int.MaxValue, companyId = _currentUser.User.CompanyId};
            var viewModel = new IncidentCreationDictionariesViewModel()
            {
                Attacks = await _dbContext.AttackDirectory.Select(x => new DictionaryDataItem<string, int>(x.Id, x.Title, x.CriticalityDefault ?? 0))
                    .ToListAsync(),
                Equipments = await _dbContext.Database.GetDbConnection()
                    .QueryAsync<EquipmentListItem>("[dbo].[EquipmentList]", equipmentListParams,
                        commandType: CommandType.StoredProcedure),
                Incidents = await _dbContext.Incidents
                    .WhereCompany(_currentUser.User.CompanyId)
                    .Include(x => x.AttackDirectory)
                    .Select(x => new IncidentListItem()
                    {
                        AttackType = x.AttackType,
                        Id = x.Id,
                        FixationTime = x.FixationTime,
                        AttackTypeName = x.AttackDirectory.Title,
                        SourceCountry = x.SourceCountry,
                        SourceIP = x.SourceIP
                    }).ToListAsync(),
                Severity = await _dbContext.IncidentCriticality
                    .Select(x => new DictionaryItem<string>(x.Id, x.Criticality)).ToListAsync()

            };
            return viewModel;
        }

        public async Task<int> Create(IncidentModel incidentModel, AppUser currentUser)
        {
            var incident = new Incident()
            {
                Title = incidentModel.Title,
                AttackType = incidentModel.AttackType,
                CreateDate = DateTimeOffset.Now,
                UpdateDate = DateTimeOffset.Now,
                CreatorUserId = incidentModel.CreatorUserId,
                DecisionTime = incidentModel.DecisionTime,
                Description = incidentModel.Description,
                DetectionMethod = incidentModel.DetectionMethod,
                ResponsibleUserId = incidentModel.ResponsibleUserId,
                SourceAddress = incidentModel.SourceAddress,
                SourceCountry = incidentModel.SourceCountry,
                SourceEquipmentId = incidentModel.SourceEquipmentId,
                SourceIP = incidentModel.SourceIP,
                IdStatus = IncidentStatus.New.Id,
                SourceURL = incidentModel.SourceURL,
                FixationTime = incidentModel.FixationTime,
                CompanyId = _currentUser.User.CompanyId,
                Criticality = incidentModel.Criticality
            };

			if(currentUser != null) 
			{ 
				incident.CreatorUserId = currentUser.Id;
				incident.UpdaterUserId = currentUser.Id;
			}

			incident.RelatedIncidents = incidentModel.RelatedIncidents?.Select(x => new IncidentRelation()
            {
                RelatedIncidentId = x
            }).ToList();


			incident.History = new List<IncidentStatusHistory>() {
				new IncidentStatusHistory()
				{
					ChangeTime = DateTimeOffset.Now,
					IdUser = currentUser?.Id,
					NewStatusId = IncidentStatus.New.Id
				}
			};

            _dbContext.Incidents.Add(incident);
            await _dbContext.SaveChangesAsync();
            if (incidentModel.Files != null)
            {
                await _fileService.Store(incident.Id, typeof(Incident).Name.ToLower(), incidentModel.Files);
            }
            if (incidentModel.RemovedFiles != null)
            {
                await _fileService.Remove(incidentModel.RemovedFiles);
            }
            return incident.Id;
        }

        public async Task<Incident> Get(int id)
        {
	        var result = await _dbContext
		        .Incidents
                .WhereCompany(_currentUser.User.CompanyId)
		        .Include(x => x.Status).ThenInclude(x => x.Transitions)
		        .Include(x => x.Status).ThenInclude(x => x.ResponsibleRole)
		        .Include(x => x.RelatedIncidents)
		        .Include(x => x.CreatorUser)
		        .Include(x => x.UpdaterUser)
		        .AsNoTracking()
		        .FirstOrDefaultAsync(x => x.Id == id);

	        if (result.CreatorUser != null) result.CreatorUser = AppUser.CleanUp(result.CreatorUser);
	        if (result.UpdaterUser != null) result.UpdaterUser = AppUser.CleanUp(result.UpdaterUser);

			return result;
        }

        public async Task<IEnumerable<IncidentStatus>> Statuses()
        {
	        return await _dbContext
		        .IncidentStatuses
		        .Include(x => x.Transitions)
		        .Include(x => x.ResponsibleRole)
		        .AsNoTracking()
		        .ToListAsync();
        }

        public async Task SetStatus(int incidentId, int statusId, string comment, AppUser currentUser)
        {
	        var incident = await Get(incidentId);
	        if (incident == null)
	        {
		        throw new ArgumentException("Инцидент не найден", nameof(incidentId));
	        }

            if (currentUser.UserRoles == null ||
                currentUser.UserRoles.Any(x => x.RoleId == incident.Status.Responsible) == false)
            {
                throw new SecurityException($"Пользователь {currentUser.UserName} не имеет прав на эту операцию");
            }

	        if (incident.Status.Transitions.Any(x => x.FinalStatusId == statusId) == false)
	        {
		        throw new ArgumentException("Данный статус не доступен", nameof(statusId));
	        }

	        _dbContext.Incidents.Attach(incident);

	        var currentStatus = await GetCurrentStatus(incidentId);

			incident.History = new List<IncidentStatusHistory>()
			{
				new IncidentStatusHistory()
				{
					ChangeTime = DateTimeOffset.Now,
					IdUser = currentUser?.Id,
					NewComment = comment,
					OldStatusId = currentStatus?.NewStatusId,
					NewStatusId = statusId
				}
			};

	        incident.IdStatus = statusId;
			incident.UpdateDate = DateTimeOffset.Now;
			incident.StatusComment = comment;
			incident.UpdaterUserId = currentUser?.Id;

	        await _dbContext.SaveChangesAsync();
        }

        public async Task<(int, List<IncidentFieldHistory>)> Update(IncidentModel incidentModel, AppUser currentUser)
        {
	        var incident = await _dbContext
		        .Incidents
                .WhereCompany(_currentUser.User.CompanyId)
		        .Include(x => x.RelatedIncidents)
		        .FirstOrDefaultAsync(x => x.Id == incidentModel.Id);

	        if (incident == null)
	        {
		        throw new ArgumentException("Инцидент не найден", nameof(incidentModel.Id));
			}

	        var currentStatus = await GetCurrentStatus(incidentModel.Id);
	        var changes = GetChanges(incident, incidentModel);
	        if (changes.Any())
	        {
				changes.ForEach(x =>
				{
					x.IdUser = currentUser?.Id;
					x.IdIncidentStatusHistory = currentStatus.Id;
				});
				_dbContext.IncidentFieldHistory.AddRange(changes);
	        }

            incident.Title = incidentModel.Title;
	        incident.AttackType = incidentModel.AttackType;
	        incident.UpdateDate = DateTimeOffset.Now;
	        incident.DecisionTime = incidentModel.DecisionTime;
	        incident.Description = incidentModel.Description;
	        incident.DetectionMethod = incidentModel.DetectionMethod;
	        incident.ResponsibleUserId = incidentModel.ResponsibleUserId;
	        incident.SourceAddress = incidentModel.SourceAddress;
	        incident.SourceCountry = incidentModel.SourceCountry;
	        incident.SourceEquipmentId = incidentModel.SourceEquipmentId;
	        incident.SourceIP = incidentModel.SourceIP;
	        incident.SourceURL = incidentModel.SourceURL;
            incident.Criticality = incidentModel.Criticality;
            incident.FixationTime = incidentModel.FixationTime;
	        incident.BlockingRecommendations = incidentModel.BlockingRecommendations;
	        incident.MitigationRecommendations = incidentModel.MitigationRecommendations;
	        incident.PreventionRecommendations = incidentModel.PreventionRecommendations;

	        if (currentUser != null)
	        {
		        incident.UpdaterUserId = currentUser.Id;
	        }

	        var existingIds = incident.RelatedIncidents.Select(x => x.RelatedIncidentId).ToList();

            if (incidentModel.RelatedIncidents != null)
            {
                foreach (var relatedId in incidentModel.RelatedIncidents)
                {
                    if (existingIds.Contains(relatedId) == false)
                    {
                        incident.RelatedIncidents.Add(new IncidentRelation()
                            {RelatedIncidentId = relatedId, SourceIncidentId = incident.Id});
                    }
                }

                var entitiesToRemove = existingIds.Except(incidentModel.RelatedIncidents).ToList();
                foreach (var id in entitiesToRemove)
                {
                    var entity = incident.RelatedIncidents.First(x => x.RelatedIncidentId == id);
                    _dbContext.IncidentRelations.Remove(entity);
                }
            }

            await _dbContext.SaveChangesAsync();
            if (incidentModel.Files != null)
            {
                await _fileService.Store(incident.Id, typeof(Incident).Name.ToLower(), incidentModel.Files);
            }
            if (incidentModel.RemovedFiles != null)
            {
                await _fileService.Remove(incidentModel.RemovedFiles);
            }
            return (incident.Id, changes);
        }

        private Task<IncidentStatusHistory> GetCurrentStatus(int incidentId)
        {
	        return _dbContext
		        .IncidentStatusHistory
		        .AsNoTracking()
		        .Where(x => x.IdIncident == incidentId)
		        .OrderByDescending(x => x.ChangeTime)
		        .FirstOrDefaultAsync();
        }

        private List<IncidentFieldHistory> GetChanges(Incident source, IncidentModel target)
        {
	        var result = new List<IncidentFieldHistory>();
            var existingRelatedIncidents = source.RelatedIncidents != null
                ? source.RelatedIncidents.Select(x => x.RelatedIncidentId).OrderBy(x => x).ToList()
                : new List<int>();
            var targetRelatedIncidents = target.RelatedIncidents != null
                ? target.RelatedIncidents.OrderBy(x => x).ToList()
                : new List<int>();

            if (existingRelatedIncidents.Count != targetRelatedIncidents.Count ||
		        existingRelatedIncidents.Intersect(targetRelatedIncidents).Count() != existingRelatedIncidents.Count)
	        {
		        result.Add(new IncidentFieldHistory("RelatedIncidents", string.Join(", ", targetRelatedIncidents),
			        string.Join(", ", existingRelatedIncidents)));
			}

            if (source.Title != target.Title)
            {
                result.Add(new IncidentFieldHistory("Title", target.Title, source.Title));
            }

	        if (source.AttackType != target.AttackType)
	        {
		        result.Add(new IncidentFieldHistory("AttackType", target.AttackType.ToString(),
			        source.AttackType.ToString()));
	        }

	        if (source.DecisionTime != target.DecisionTime)
	        {
		        result.Add(new IncidentFieldHistory("DecisionTime", target.DecisionTime?.ToString("yyyy-MM-ddTHH\\:mm\\:ss.fffffffzzz"),
			        source.DecisionTime?.ToString("yyyy-MM-ddTHH\\:mm\\:ss.fffffffzzz")));
	        }

	        if (source.Description != target.Description)
	        {
		        result.Add(new IncidentFieldHistory("Description", target.Description, source.Description));
	        }

	        if (source.DetectionMethod != target.DetectionMethod)
	        {
		        result.Add(new IncidentFieldHistory("DetectionMethod", target.DetectionMethod, source.DetectionMethod));
	        }

	        if (source.SourceAddress != target.SourceAddress)
	        {
		        result.Add(new IncidentFieldHistory("SourceAddress", target.SourceAddress, source.SourceAddress));
	        }

	        if (source.SourceCountry != target.SourceCountry)
	        {
		        result.Add(new IncidentFieldHistory("SourceCountry", target.SourceCountry, source.SourceCountry));
	        }

	        if (source.SourceEquipmentId != target.SourceEquipmentId)
	        {
		        result.Add(new IncidentFieldHistory("SourceEquipmentId", target.SourceEquipmentId.ToString(),
			        source.SourceEquipmentId.ToString()));
	        }

	        if (source.SourceIP != target.SourceIP)
	        {
		        result.Add(new IncidentFieldHistory("SourceIP", target.SourceIP, source.SourceIP));
	        }

	        if (source.SourceURL != target.SourceURL)
	        {
		        result.Add(new IncidentFieldHistory("SourceURL", target.SourceURL, source.SourceURL));
	        }

	        if (source.FixationTime != target.FixationTime)
	        {
		        result.Add(new IncidentFieldHistory("FixationTime", target.FixationTime.ToString("yyyy-MM-ddTHH\\:mm\\:ss.fffffffzzz"),
			        source.FixationTime.ToString("yyyy-MM-ddTHH\\:mm\\:ss.fffffffzzz")));
	        }

	        if (source.BlockingRecommendations != target.BlockingRecommendations)
	        {
		        result.Add(new IncidentFieldHistory("BlockingRecommendations", target.BlockingRecommendations, source.BlockingRecommendations));
			}

	        if (source.MitigationRecommendations != target.MitigationRecommendations)
	        {
		        result.Add(new IncidentFieldHistory("MitigationRecommendations", target.MitigationRecommendations, source.MitigationRecommendations));
	        }

	        if (source.PreventionRecommendations != target.PreventionRecommendations)
	        {
		        result.Add(new IncidentFieldHistory("PreventionRecommendations", target.PreventionRecommendations, source.PreventionRecommendations));
	        }

            if (source.Criticality != target.Criticality)
            {
                result.Add(new IncidentFieldHistory("Criticality", target.Criticality?.ToString(), source.Criticality?.ToString()));
            }
			return result;
        }

        public async Task<PaginationModel<IncidentStatusHistory>> GetHistory(IncidentHistoryFilter filter)
        {
            if(filter == null) 
                throw new ArgumentNullException(nameof(filter));

            var incident = await _dbContext.Incidents.SingleOrDefaultAsync(x => x.Id == filter.Id);
            if (!_accessControlService.HasAccess(incident))
            {
                return new PaginationModel<IncidentStatusHistory>(){
                    Items = new List<IncidentStatusHistory>(),
                    Total = 0
                };
            }

	        var query = _dbContext
		        .IncidentStatusHistory
		        .Include(x => x.FieldHistory)
		        .AsNoTracking()
		        .Where(x => x.IdIncident == filter.Id);

            
            return new PaginationModel<IncidentStatusHistory>()
            {
                Items = await query.OrderByDescending(x => x.ChangeTime).ToListAsync(),
                Total = await query.CountAsync()
            };            
        }

        public async Task<IncidentStatisticResult> GetStatistic(StatisticFilter filter)
        {
            var query = _dbContext.Incidents
                .WhereCompany(_currentUser.User.CompanyId);
            DateTimeOffset? dateFrom = null;
            DateTimeOffset? dateTo = null;
            switch (filter.Period)
            {
                case IncidentStatisticPeriod.Week:
                    dateFrom = DateTimeOffset.Now.AddDays(-7).Date;
                    break;
                case IncidentStatisticPeriod.Month:
                    dateFrom = DateTimeOffset.Now.AddDays(-30).Date;
                    break;
                case IncidentStatisticPeriod.Period:
                    dateFrom = filter.DateFrom;
                    dateTo = filter.DateTo;
                    break;
            }
            if (dateFrom.HasValue)
            {
                query = query.Where(x => x.FixationTime >= dateFrom.Value);
            }
            if (dateTo.HasValue)
            {
                var to = dateTo.Value.AddDays(1).Date;
                query = query.Where(x => x.FixationTime < to);
            }

            var result = new IncidentStatisticResult()
            {
                GroupType = filter.GroupType.ToString(),
                Period = filter.Period.ToString(),
            };
            if (filter.GroupType == IncidentStatisticGroupType.AttackType)
            {
                var attackTypes = await _dbContext.AttackDirectory.ToListAsync();
                var statistic = await query.GroupBy(x => x.AttackType)
                    .Select(x =>
                        new
                        {
                            x.Key,
                            Count = x.Count()
                        }
                    ).ToListAsync();
                result.Statistic = statistic.Select(x => new DictionaryItem<string, int>()
                {
                    Key = attackTypes.SingleOrDefault(a => a.Id == x.Key)?.Title,
                    Value = x.Count
                }).ToList();
                result.Title = "Типы атак";
            }
            else
            {
                var stat = await query.GroupBy(x => x.FixationTime.Date)
                    .Select(x =>
                        new
                        {
                            x.Key,
                            Count = x.Count()
                        }
                    ).ToListAsync();

                var startDate = dateFrom
                                ?? (stat.Any()
                                    ? stat.OrderBy(x => x.Key).First().Key.StartOfMonth()
                                    : DateTimeOffset.Now.StartOfMonth());
                var endDate = dateTo ?? DateTimeOffset.Now;
                bool groupByMonth = (endDate - startDate).TotalDays > 31;
                bool groupByDays = !groupByMonth && (endDate - startDate).TotalDays > 7;

                string dateFormat = "dd.MM.yyyy";
                if (filter.Period == IncidentStatisticPeriod.Month || (filter.Period == IncidentStatisticPeriod.Period && groupByDays))
                {
                    dateFormat = "dd.MM";
                }
                else if (filter.Period == IncidentStatisticPeriod.Period && groupByMonth)
                {
                    dateFormat = "MMM yy";
                }

                result.Title = $"{startDate:dd.MM.yyyy} - {endDate:dd.MM.yyyy}";
                result.Statistic = new List<DictionaryItem<string, int>>();

                var orderedStat = stat.OrderBy(x => x.Key).ToList();
                if (filter.Period == IncidentStatisticPeriod.Period && groupByMonth)
                {
                    var fromDate = startDate;
                    while (fromDate <= endDate.StartOfMonth())
                    {
                        var toDate = fromDate.AddMonths(1);
                        var count = orderedStat.Where(x => x.Key.Date >= fromDate && x.Key.Date < toDate)
                            .DefaultIfEmpty()
                            .Sum(x => x?.Count ?? 0);
                        result.Statistic.Add(new DictionaryItem<string, int>(fromDate.ToString(dateFormat), count));
                        fromDate = toDate;
                    }
                }
                else
                {
                    var fromDate = startDate;
                    while (fromDate <= endDate)
                    {
                        var count = orderedStat.Where(x => x.Key.Date == fromDate)
                            .DefaultIfEmpty()
                            .Sum(x => x?.Count ?? 0);
                        result.Statistic.Add(new DictionaryItem<string, int>(fromDate.ToString(dateFormat), count));
                        fromDate = fromDate.AddDays(1);
                    }
                }
            }

            return result;
        }
    }

    public class IncidentStatisticResult
    {
        public IncidentStatisticResult()
        {
            Statistic = new List<DictionaryItem<string, int>>();
        }

        public string Title { get; set; }

        public string Period { get; set; }

        public string GroupType { get; set; }

        public List<DictionaryItem<string, int>> Statistic { get; set; }
    }
}