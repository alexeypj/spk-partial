using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.DTO;
using sopka.Models.Filters;
using sopka.Models.KnowledgeBase;
using sopka.Models.Mappers;
using sopka.Models.ViewModels;

namespace sopka.Services
{
	public class KnowledgeBaseService
	{
		private readonly SopkaDbContext _context;
		private readonly string _connectionString;
		private readonly FileService _fileService;
        private readonly AccessControlService _accessControlService;
        private readonly CurrentUser _currentUser;

		public KnowledgeBaseService(SopkaDbContext context, FileService service, AccessControlService accessControlService, CurrentUser currentUser)
		{
			_context = context;
			_fileService = service;
            _accessControlService = accessControlService;
            _currentUser = currentUser;
            _connectionString = _context.Database.GetDbConnection().ConnectionString;
		}

		public async Task<ArticleFolder> Store(ArticleFolder folder)
		{
			if (folder.Id != 0)
			{
				var entity = await _context.ArticleFolders.FindAsync(folder.Id);
				if(entity == null) throw new Exception($"Папка не найдена {folder.Id}");

                if (!_accessControlService.HasAccess(entity))
                {
                    throw new InvalidOperationException("Нет доступа");
                }

				entity.IdParent = folder.IdParent;
				entity.Title = folder.Title;
				folder.Id = entity.Id;
			}
			else
            {
                folder.CompanyId = _currentUser.User.CompanyId;
				_context.ArticleFolders.Add(folder);
			}
			await _context.SaveChangesAsync();
			return folder;
		}

		public async Task<IEnumerable<ArticleFolder>> GetFolders()
		{
			return await _context.ArticleFolders.WhereCompany(_currentUser.User.CompanyId).ToListAsync();
		}

		public async Task<KnowledgeBaseDictionaryViewModel> LoadDictionaries()
		{
			using (var conn = new SqlConnection(_connectionString))
			{
				conn.Open();
				var items = (await conn.QueryAsync<EquipmentDictionaryItem>($"execute [dbo].[KnowledgeBaseDictionaries]")).ToList();
				var result = new KnowledgeBaseDictionaryViewModel()
				{
					DeviceTypes = items.Where(x => x.Type.Equals("DeviceType")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					Platforms = items.Where(x => x.Type.Equals("Platform")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					RaidTypes = items.Where(x => x.Type.Equals("RaidType")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					CPU = items.Where(x => x.Type.Equals("CPU")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					Memory = items.Where(x => x.Type.Equals("Memory")).Select(x => new DictionaryDataItem<string, float?>(x.Id, x.Value, x.Data)),
					Objects = items.Where(x => x.Type.Equals("Object")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					OS = items.Where(x => x.Type.Equals("OS")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					Software = items.Where(x => x.Type.Equals("Software")).Select(x => new DictionaryItem<string>(x.Id, x.Value)),
					HDD = items.Where(x => x.Type.Equals("HDD")).Select(x => new DictionaryDataItem<string, float?>(x.Id, x.Value, x.Data)),
					NetworkAdapters = items.Where(x => x.Type.Equals("NetworkAdapter")).Select(x => new DictionaryDataItem<string, float?>(x.Id, x.Value, x.Data)),
					AttackTypes = items.Where(x => x.Type.Equals("AttackType")).Select(x => new DictionaryItem<string>(x.Id, x.Value))
				};
				return result;
			}
		}

		public async Task<Article> Store(ArticleModel model, string userId)
		{
			Article article;
			if (model.Id > 0)
			{
				article = await _context.Articles
                    .FirstOrDefaultAsync(x => x.Id == model.Id);
				if (article == null)
				{
					throw new Exception($"Article {model.Id} not found");
				}

                if (!_accessControlService.HasAccess(article))
                {
                    throw new InvalidOperationException("Нет доступа");
                }

				var tags = await _context.ArticleTags.Where(x => x.IdArticle == model.Id).ToListAsync();
				_context.RemoveRange(tags);
			}
			else
			{
				article = new Article()
				{
					Id = 0, 
					CreateDate = DateTimeOffset.Now, 
					IdCreator =  userId,
                    CompanyId = _currentUser.User.CompanyId
				};
                if (model.BaseIncidentId.HasValue)
                {
                    article.RelatedIncidents.Add(new IncidentArticle()
                    {
                        IncidentId = model.BaseIncidentId.Value,
                        Type = IncidentArticle.RelationType.Based   
                    });
                }
                _context.Articles.Attach(article);
            }
			article = ArticleMappers.FromModel(model, article);

			await _context.SaveChangesAsync();
			await StoreFiles(article.Id, model.Files);
			await RemoveFiles(model.RemovedFiles);
            await _fileService.ImportFiles(article.Id, typeof(Article).Name.ToLower(), model.ImportedFiles);
			return article;
		}

		private async Task StoreTags(Article model)
		{
			var tags = await _context.ArticleTags.AsNoTracking().Where(x => x.IdArticle == model.Id).ToListAsync();
			var toRemove = tags.Where(tag => model.Tags.Contains(tag) == false).ToList();
			var toAdd = model.Tags.Where(tag => tags.Contains(tag) == false).ToList();
			toRemove.ForEach(tag => {
				_context.ArticleTags.Attach(tag);
				_context.ArticleTags.Remove(tag);
			});

			_context.ArticleTags.AddRange(toAdd);
			await _context.SaveChangesAsync();
		}

		private async Task StoreFiles(int id, List<IFormFile> files)
		{
			await _fileService.Store(id, typeof(Article).Name.ToLower(), files);
		}

		private async Task RemoveFiles(int[] fileIds)
		{
			await _fileService.Remove(fileIds);
		}

		public async Task<ArticleModel> GetArticle(int id)
		{
			var result = await _context
				.Articles
				.Include(x => x.Tags)
				.AsNoTracking()
                .WhereCompany(_currentUser.User.CompanyId)
				.FirstOrDefaultAsync(x => x.Id == id);

			if (result == null) throw new ArgumentException("Article not found", nameof(id));
			return ArticleMappers.FromEntity(result);
		}

		public async Task<List<Article>> Articles(KbFilter filter)
        {
            var query = _context.Articles.WhereCompany(_currentUser.User.CompanyId).AsQueryable();
            if (filter.AttackTypeId.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.AttackTypeTags && tag.IdDirectory == filter.AttackTypeId.Value) 
                    || article.Tags.Any(tag => tag.DirectoryType == Article.AttackTypeTags) == false);

            if (filter.EquipmentTypeId.HasValue)
                query = query.Where(article =>
                    article.Tags.Any(tag =>
                        tag.DirectoryType == Article.EquipmentTypeTags &&
                        tag.IdDirectory == filter.EquipmentTypeId.Value)
                    || article.Tags.Any(tag => tag.DirectoryType == Article.EquipmentTypeTags) == false);

            if (filter.PlatformId.HasValue)
                query = query.Where(article =>
                    article.Tags.Any(tag =>
                        tag.DirectoryType == Article.PlatformTags && tag.IdDirectory == filter.PlatformId.Value)
                    || article.Tags.Any(tag => tag.DirectoryType == Article.PlatformTags) == false);
            ;

            if (filter.MemoryId.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.MemoryTags && tag.IdDirectory == filter.MemoryId.Value)
                                               || article.Tags.Any(tag => tag.DirectoryType == Article.MemoryTags) == false);

            if (filter.CpuId.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.CPUTags && tag.IdDirectory == filter.CpuId.Value)
                                               || article.Tags.Any(tag => tag.DirectoryType == Article.CPUTags) == false);

            if (filter.Raid.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.RaidTags && tag.IdDirectory == filter.Raid.Value)
                                               || article.Tags.Any(tag => tag.DirectoryType == Article.RaidTags) == false);

            if (filter.HDD.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.HddTags && tag.IdDirectory == filter.HDD.Value)
                                               || article.Tags.Any(tag => tag.DirectoryType == Article.HddTags) == false);

            if (filter.NetworkAdapter.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.NetworkAdapterTags && tag.IdDirectory == filter.NetworkAdapter.Value)
                                               || article.Tags.Any(tag => tag.DirectoryType == Article.NetworkAdapterTags) == false);

            if (filter.Software.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.SoftwareTags && tag.IdDirectory == filter.Software.Value)
                                               || article.Tags.Any(tag => tag.DirectoryType == Article.SoftwareTags) == false);

            if (filter.OS.HasValue)
                query = query.Where(article => article.Tags.Any(tag => tag.DirectoryType == Article.OSTags && tag.IdDirectory == filter.OS.Value)
                                               || article.Tags.Any(tag => tag.DirectoryType == Article.OSTags) == false);

            if (!string.IsNullOrEmpty(filter.Query))
            {
                query = query.Where(x => x.Title.Contains(filter.Query));
            }

            var result = await query.Select(x => new
			{
				x.Id,
				x.IdFolder,
				x.Title
			}).ToListAsync();

			return result.Select(x => new Article()
			{
				Id = x.Id,
				IdFolder = x.IdFolder,
				Title = x.Title
			}).ToList();
		}

		public async Task<List<FileViewModel>> GetFiles(int id)
		{
			return await _fileService.GetFiles(id, typeof(Article).Name.ToLower());
		}

		public async Task<List<KnowledgeBaseIncidentMatch>> GetRelatedArticles(int incidentId, int[] excludeArticles)
		{
			var incident = await _context.Incidents
				.AsNoTracking()
				.FirstOrDefaultAsync(x => x.Id == incidentId);
			if (incident == null) throw new ArgumentException($"Инцидент {incidentId} не найден", nameof(incidentId));
			if (incident.SourceEquipmentId.HasValue == false) throw new ArgumentException($"К инциденту {incident} не привязано оборудование", nameof(incident));

			var equipment = await _context.Equipment
				.Include(x => x.Devices)
				.Include(x => x.Devices).ThenInclude(x => x.Memory)
				.Include(x => x.Devices).ThenInclude(x => x.HDD)
				.Include(x => x.Devices).ThenInclude(x => x.Software)
				.Include(x => x.Devices).ThenInclude(x => x.OperationSystems)
				.Include(x => x.Devices).ThenInclude(x => x.NetworkAdapters)
				.AsNoTracking()
				.FirstOrDefaultAsync(x => x.Id == incident.SourceEquipmentId.Value);
			if (equipment == null) throw new ArgumentException($"Оборудование {incident.SourceEquipmentId.Value} не найдено", nameof(incident.SourceEquipmentId.Value));
			
			var tags = GetTags(equipment, incident);
			var articles = await MatchArticles(excludeArticles, tags);
			var matches = Matches(articles, tags);
			return matches
				.Where(x => x.MatchTags.Count > 1)
				.OrderByDescending(x => x.MatchTags.Count)
				.Take(5)
				.ToList();
		}

		private async Task<List<Article>> MatchArticles(int[] excludeArticles, IncidentsTags tags)
		{
			var articleIds = (await _context.ArticleTags.AsNoTracking()
				.Where(x => (tags.PlatformId.HasValue && x.DirectoryType == Article.PlatformTags && x.IdDirectory == tags.PlatformId.Value) ||
				            (x.DirectoryType == Article.EquipmentTypeTags && x.IdDirectory == tags.EquipmentTypeId) ||
				            (tags.CpuTagId.HasValue && x.DirectoryType == Article.CPUTags && x.IdDirectory == tags.CpuTagId.Value) ||
				            (tags.MemoryTagId.Any() && x.DirectoryType == Article.MemoryTags && tags.MemoryTagId.Contains(x.IdDirectory)) ||
				            (tags.HddTagId.Any() && x.DirectoryType == Article.HddTags && tags.HddTagId.Contains(x.IdDirectory)) ||
				            (tags.RaidTagId.Any() && x.DirectoryType == Article.RaidTags && tags.RaidTagId.Contains(x.IdDirectory)) ||
				            (tags.NetworkTagId.Any() && x.DirectoryType == Article.NetworkAdapterTags && tags.NetworkTagId.Contains(x.IdDirectory)) ||
				            (tags.OsTagId.Any()) && x.DirectoryType == Article.OSTags && tags.OsTagId.Contains(x.IdDirectory) ||
				            (tags.SoftwareTagId.Any() && x.DirectoryType == Article.SoftwareTags && tags.SoftwareTagId.Contains(x.IdDirectory))
				).Select(x => x.IdArticle)
				.ToListAsync())
				.Distinct();

			if (excludeArticles != null)
			{
				articleIds = articleIds.Except(excludeArticles).ToList();
			}

			if (articleIds.Any())
			{
				return await _context.Articles
					.Include(x => x.Tags)
					.AsNoTracking()
                    .WhereCompany(_currentUser.User.CompanyId)
					.Where(x => articleIds.Contains(x.Id))
					.ToListAsync();
			}
			return null;
		}

		private IncidentsTags GetTags(Equipment equipment, Incident incident)
		{
			var device = equipment.Devices.First();
			return new IncidentsTags()
			{
				PlatformId = equipment.Platform,
				EquipmentTypeId = equipment.Type,
				CpuTagId = device.IdCPU,
				MemoryTagId = device.Memory?.Select(x => x.IdRAMDirectory).ToList() ?? new List<int>(),
				HddTagId = device.HDD?.Select(x => x.IdHDDDirectory).ToList() ?? new List<int>(),
				RaidTagId = device.HDD?.Where(x => x.IdRAIDDirectory.HasValue).Select(x => x.IdRAIDDirectory.Value).ToList() ?? new List<int>(),
				NetworkTagId = device.NetworkAdapters?.Select(x => x.IdNetworkAdapterDirectory).ToList() ?? new List<int>(),
				OsTagId = device.OperationSystems?.Select(x => x.IdOSDirectory).ToList() ?? new List<int>(),
				SoftwareTagId = device.Software?.Select(x => x.IdSoftDirectory).ToList() ?? new List<int>(),
				AttackTypeId = incident.AttackType
			};
		}
		
		private int MatchCount(Article article, string directoryType, List<int> values)
		{
			var directoryIds = article.Tags.Where(x => x.DirectoryType == directoryType).Select(x => x.IdDirectory)
				.ToList();
			return directoryIds.Intersect(values).Count();
		}

		private int MatchCount(Article article, string directoryType, int? value)
		{
			if (value.HasValue)
			{
				if (article.Tags.Any(x => x.DirectoryType == directoryType && x.IdDirectory == value.Value))
				{
					return 1;
				}
			}
			return 0;
		}

		private List<KnowledgeBaseIncidentMatch> Matches(List<Article> articles, IncidentsTags tags)
		{
			var result = new List<KnowledgeBaseIncidentMatch>();
			foreach (var article in articles)
			{
				var item = new KnowledgeBaseIncidentMatch()
				{
					ArticleId = article.Id,
					ArticleName = article.Title
				};
				
				var platformMatch = MatchCount(article, Article.PlatformTags, tags.PlatformId);
				if (platformMatch > 0) item.MatchTags.Add(Article.PlatformTags);

				var equipmentTypeMatch = MatchCount(article, Article.EquipmentTypeTags, tags.EquipmentTypeId);
				if(equipmentTypeMatch > 0) item.MatchTags.Add(Article.EquipmentTypeTags);

				var cpuMatch = MatchCount(article, Article.CPUTags, tags.CpuTagId);
				if(cpuMatch > 0) item.MatchTags.Add(Article.CPUTags);

				var memoryMatch = MatchCount(article, Article.MemoryTags, tags.MemoryTagId);
				if(memoryMatch > 0) item.MatchTags.Add(Article.MemoryTags);

				var hddMatch = MatchCount(article, Article.HddTags, tags.HddTagId);
				if(hddMatch > 0) item.MatchTags.Add(Article.HddTags);

				var raidMatch = MatchCount(article, Article.RaidTags, tags.RaidTagId);
				if(raidMatch > 0) item.MatchTags.Add(Article.RaidTags);

				var networkMatch = MatchCount(article, Article.NetworkAdapterTags, tags.NetworkTagId);
				if(networkMatch > 0) item.MatchTags.Add(Article.NetworkAdapterTags);

				var osMatch = MatchCount(article, Article.OSTags, tags.OsTagId);
				if(osMatch > 0) item.MatchTags.Add(Article.OSTags);

				var softwareMatch = MatchCount(article, Article.SoftwareTags, tags.SoftwareTagId);
				if (softwareMatch > 0) item.MatchTags.Add(Article.SoftwareTags);

				var attackTypeMatch = MatchCount(article, Article.AttackTypeTags, tags.AttackTypeId);
				if (attackTypeMatch > 0) item.MatchTags.Add(Article.AttackTypeTags);

				result.Add(item);
			}
			return result;
		}

        /// <summary>
        /// Указание, что статья из базы знаний решает инцидент
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="incidentId"></param>
        /// <returns></returns>
        public async Task<bool> AttachIncident(int articleId, int incidentId)
        {
            var incident = _context.Incidents.AsNoTracking().SingleOrDefault(x => x.Id == incidentId);
            if (incident != null && !_accessControlService.HasAccess(incident))
            {
                throw new InvalidOperationException("Нет доступа");
            }
            var article = _context.Articles.AsNoTracking().SingleOrDefault(x => x.Id == incidentId);
            if (article != null && !_accessControlService.HasAccess(article))
            {
                throw new InvalidOperationException("Нет доступа");
            }
            var entity = await _context.IncidentArticles.FirstOrDefaultAsync(x => x.IncidentId == incidentId && x.ArticleId == articleId);
            if (entity != null)
            {
                if (entity.Type == IncidentArticle.RelationType.Resolved)
                {
                    return false;
                }
                entity.Type = IncidentArticle.RelationType.BasedResolved;
            }
            else
            {
                _context.IncidentArticles.Add(new IncidentArticle()
                {
                    ArticleId = articleId,
                    IncidentId = incidentId,
                    Type = IncidentArticle.RelationType.Resolved
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Удаление связи между инцидентов и статьей
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="incidentId"></param>
        /// <returns></returns>
        public async Task<bool> DetachIncident(int articleId, int incidentId)
        {
            var incident = _context.Incidents.AsNoTracking().SingleOrDefault(x => x.Id == incidentId);
            if (incident != null && !_accessControlService.HasAccess(incident))
            {
                throw new InvalidOperationException("Нет доступа");
            }
            var article = _context.Articles.AsNoTracking().SingleOrDefault(x => x.Id == articleId);
            if (article != null && !_accessControlService.HasAccess(article))
            {
                throw new InvalidOperationException("Нет доступа");
            }

            var entity = await _context.IncidentArticles.FirstOrDefaultAsync(x => x.IncidentId == incidentId && x.ArticleId == articleId);
            if (entity != null)
            {
                if (entity.Type == IncidentArticle.RelationType.Resolved)
                {
                    _context.IncidentArticles.Remove(entity);
                }
                else
                {
                    entity.Type = IncidentArticle.RelationType.Based;
                }
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        /// <summary>
        /// Получение списка связанных статей
        /// </summary>
        /// <param name="incidentId"></param>
        /// <returns></returns>
        public async Task<List<IncidentArticle>> GetAttachedArticles(int incidentId)
        {
            var incident = _context.Incidents.AsNoTracking().SingleOrDefault(x => x.Id == incidentId);
            if (incident != null && !_accessControlService.HasAccess(incident))
            {
                throw new InvalidOperationException("Нет доступа");
            }
            return await _context.IncidentArticles
                .AsNoTracking()
                .Where(x => x.IncidentId == incidentId)
                .ToListAsync();
          
        }

        /// <summary>
        /// Получение списка связанных инцидентов
        /// </summary>
        /// <param name="articleId"></param>
        /// <returns></returns>
        public async Task<List<IncidentArticle>> GetAttachedIncidents(int articleId)
        {
            var article = _context.Articles.AsNoTracking().SingleOrDefault(x => x.Id == articleId);
            if (article != null && !_accessControlService.HasAccess(article))
            {
                throw new InvalidOperationException("Нет доступа");
            }
            return await _context.IncidentArticles
                .Include(x => x.Incident)
                .AsNoTracking()
                .Where(x => x.ArticleId == articleId)
                .ToListAsync();

        }

        public async Task<ArticleModel> GetPreview(int articleId)
        {
            var result = await _context
                .Articles
                .Include(x => x.Tags)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == articleId);

            if (result == null) throw new ArgumentException("Article not found", nameof(articleId));
            if (!_accessControlService.HasAccess(result))
            {
                throw new InvalidOperationException("Нет доступа");
            }

            var stripHtml = new Regex("<[^>]*(>|$)");
            var normalize = new Regex("[\\s\\r\\n]+");
            
            var description = string.IsNullOrEmpty(result.Description) ? string.Empty :
                normalize.Replace(stripHtml.Replace(result.Description.Replace("&nbsp;", " "), string.Empty), " ").Trim();
            if (description.Length > 200) description = description.Substring(0, 200);
            
            var solution = string.IsNullOrEmpty(result.Solution) ? string.Empty :
                normalize.Replace(stripHtml.Replace(result.Solution.Replace("&nbsp;", " "), string.Empty), " ").Trim();
            if (solution.Length > 200) solution = solution.Substring(0, 200);

            var model = ArticleMappers.FromEntity(result);
            model.Solution = solution;
            model.Description = description;

            return model;
        }

        public async Task<bool> RemoveIncident(int id)
        {
            var entity = await _context.Articles.FirstOrDefaultAsync(x => x.Id == id);
            if (entity != null)
            {
                if (!_accessControlService.HasAccess(entity))
                {
                    throw new InvalidOperationException("Нет доступа");
                }
                _context.Articles.Remove(entity);
                await _context.SaveChangesAsync();
                var files = await _fileService.GetFiles(id, typeof(Article));
                if (files.Any())
                {
                    await _fileService.Remove(files.Select(x => x.Id).ToArray());
                }

                return true;
            }

            return false;
        }
    }
}
