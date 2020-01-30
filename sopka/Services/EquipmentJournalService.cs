using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using sopka.Controllers;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.DTO;
using sopka.Models.EquipmentLogs;
using sopka.Models.Filters;

namespace sopka.Services
{
    public class EquipmentJournalService
    {
        private readonly SopkaDbContext _dbContext;

        public EquipmentJournalService(SopkaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<EquipmentJournalDictionaries> GetDictionaries()
        {
            var dics = new EquipmentJournalDictionaries()
            {
                EquipmentTypes = await _dbContext.EquipmentDirectory
                    .Select(x => new DictionaryItem<string>(x.Id, x.Title)).ToListAsync(),
                Objects = await _dbContext.Objects.Select(x => new DictionaryItem<string>(x.Id, x.ObjectName))
                    .ToListAsync(),
                Platforms = await _dbContext.PlatformDirectory
                    .Select(x => new DictionaryItem<string>(x.Id, x.Manufacturer + " " + x.Product)).ToListAsync(),
                Equipments = await _dbContext.Equipment.Select(x => new DictionaryItem<string>(x.Id, x.Name))
                    .ToListAsync(),
            };
            return dics;
        }

        public async Task<PaginationModel<EquipmentJournalItem>> GetJournal(EquipmentJournalFilter filter)
        {
            var query = _dbContext.EquipmentLogs.AsQueryable();
            if (filter.DateFrom.HasValue)
            {
                query = query.Where(x => x.Date >= filter.DateFrom);
            }

            if (filter.DateTo.HasValue)
            {
                query = query.Where(x => x.Date <= filter.DateTo);
            }

            if (filter.EquipmentId.HasValue)
            {
                query = query.Where(x => x.EquipmentId == filter.EquipmentId);
            }

            if (filter.PlatformId.HasValue)
            {
                query = query.Where(x => x.Equipment.Platform == filter.PlatformId);
            }

            if (filter.ObjectId.HasValue)
            {
                query = query.Where(x => x.Equipment.IdObject == filter.ObjectId);
            }

            if (filter.EquipmentTypeId.HasValue)
            {
                query = query.Where(x => x.Equipment.Type == filter.EquipmentTypeId);
            }

            var dataQuery = query;
            if (!string.IsNullOrEmpty(filter.SortColumn))
            {
                switch (filter.SortColumn)
                {
                    case nameof(EquipmentJournalItem.Level):
                        dataQuery = filter.SortDirection == Direction.Asc
                            ? query.OrderBy(x => x.Level)
                            : query.OrderByDescending(x => x.Level);
                        break;
                    case nameof(EquipmentJournalItem.EquipmentName):
                        dataQuery = filter.SortDirection == Direction.Asc
                            ? query.OrderBy(x => x.Equipment.Name)
                            : query.OrderByDescending(x => x.Equipment.Name);
                        break;
                    case nameof(EquipmentJournalItem.Source):
                        dataQuery = filter.SortDirection == Direction.Asc
                            ? query.OrderBy(x => x.Source)
                            : query.OrderByDescending(x => x.Source);
                        break;
                    case nameof(EquipmentJournalItem.Date):
                    default:
                        dataQuery = filter.SortDirection == Direction.Asc
                            ? query.OrderBy(x => x.Date)
                            : query.OrderByDescending(x => x.Date);
                        break;
                }
            }

            var journal = await dataQuery.Skip(filter.Skip).Take(filter.ItemsPerPage)
                .Select(x => new EquipmentJournalItem()
                {
                    Id = x.Id,
                    Level = x.Level,
                    Date = x.Date,
                    EquipmentId = x.EquipmentId,
                    Source = x.Source,
                    Description = x.Description,
                    EquipmentName = x.Equipment.Name
                })
                .ToListAsync();

            var count = await query.CountAsync();

            return new PaginationModel<EquipmentJournalItem>()
            {
                Items = journal,
                Total = count
            };
        }
    }

    public class EquipmentJournalDictionaries
    {
        public List<DictionaryItem<string>> Objects { get; set; }

        public List<DictionaryItem<string>> EquipmentTypes { get; set; }

        public List<DictionaryItem<string>> Platforms { get; set; }

        public List<DictionaryItem<string>> Equipments { get; set; }
    }
}