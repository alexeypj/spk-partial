using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.Web.CodeGeneration;
using sopka.Controllers;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.Filters;

namespace sopka.Services
{
    public class CompaniesService
    {
        private readonly SopkaDbContext _dbContext;
        private readonly BalanceService _balanceService;
        private readonly ILogger<CompaniesService> _logger;

        public CompaniesService(SopkaDbContext dbContext, BalanceService balanceService, ILogger<CompaniesService> logger)
        {
            _dbContext = dbContext;
            _balanceService = balanceService;
            _logger = logger;
        }

        public async Task<PaginationModel<CompanyListItem>> GetCompanies(CompaniesFilter filter)
        {
            var query = _dbContext.Companies.AsQueryable();

            IQueryable<Company> itemsQuery = query
                .Include(x => x.CompanyTariff)
                .Include(x => x.Tariff)
                .Include(x => x.Balance);

            if (filter.Support.HasValue)
            {
                itemsQuery = itemsQuery.Where(x => x.CompanyTariff.Support == (filter.Support == 1));
            }

            if (!string.IsNullOrEmpty(filter.Name))
            {
                itemsQuery = itemsQuery.Where(x => x.Name.Contains(filter.Name));
            }

            if (filter.PaidTo.HasValue)
            {
                itemsQuery = itemsQuery.Where(x => x.PaidTo == filter.PaidTo);
            }

            if (!string.IsNullOrEmpty(filter.ResponsiblePersonEmail))
            {
                itemsQuery = itemsQuery.Where(x => x.ResponsiblePersonEmail.Contains(filter.ResponsiblePersonEmail));
            }

            if (!string.IsNullOrEmpty(filter.Comment))
            {
                itemsQuery = itemsQuery.Where(x => x.Comment.Contains(filter.Comment));
            }

            Expression<Func<Company, object>> order;
            switch (filter.SortColumn)
            {
                case nameof(CompanyListItem.Name):
                    order = x => x.Name;
                    break;
                case nameof(CompanyListItem.PaidTo):
                    order = x => x.PaidTo;
                    break;
                case nameof(CompanyListItem.Support):
                    order = x => x.CompanyTariff.Support;
                    break;
                case nameof(CompanyListItem.ResponsiblePersonEmail):
                    order = x => x.ResponsiblePersonEmail;
                    break;
                case nameof(CompanyListItem.Comment):
                    order = x => x.Comment;
                    break;
                default:
                    order = x => x.Id;
                    break;
            }

            if (filter.SortDirection == Direction.Asc)
                itemsQuery = itemsQuery.OrderBy(order);
            else
                itemsQuery = itemsQuery.OrderByDescending(order);

            var list = (await itemsQuery
                .Skip(filter.Skip)
                .Take(filter.ItemsPerPage).ToListAsync())
                .Select(x => new CompanyListItem()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Paid = x.PaidTo > DateTimeOffset.Now,
                    CreateDate = x.CreateDate,
                    TariffId = x.TariffId,
                    TariffName = x.Tariff.Name,
                    Balance = x.Balance?.Value ?? 0,
                    PaidTo = x.PaidTo,
                    ObjectsCount = x.CompanyTariff?.ObjectsCount ?? 0,
                    UsersCount = x.CompanyTariff?.UsersCount ?? 0,
                    EquipmentsCount = x.CompanyTariff?.EquipmentsCount ?? 0,
                    Support = x.CompanyTariff?.Support ?? false,
                    Comment = x.Comment,
                    ResponsiblePersonEmail = x.ResponsiblePersonEmail
                }).ToList();

            var count = await query.CountAsync();

            return new PaginationModel<CompanyListItem>()
            {
                Items = list,
                Total = count
            };
        }

        public async Task<CompanyCard> GetCompanyCard(int companyId)
        {
            var company = await _dbContext.Companies
                .AsNoTracking()
                .Include(x => x.Balance)
                .Include(x => x.CompanyTariff)
                .SingleOrDefaultAsync(x => x.Id == companyId);

            var currentUsersCount = await _dbContext.Users.CountAsync(x => x.CompanyId == companyId);
            var currentObjectsCount = await _dbContext.Objects.CountAsync(x => x.CompanyId == companyId);
            var currentEquipmentsCount = await _dbContext.Equipment.CountAsync(x => x.CompanyId == companyId);

            return new CompanyCard()
            {
                CompanyInfo = company,
                CurrentEquipmentsCount = currentEquipmentsCount,
                CurrentObjectsCount = currentObjectsCount,
                CurrentUsersCount = currentUsersCount,
                MaxEquipmentsCount = company.CompanyTariff.EquipmentsCount,
                MaxObjectsCount = company.CompanyTariff.ObjectsCount,
                MaxUsersCount = company.CompanyTariff.UsersCount,
            };
        }

        public async Task<Company> Store(Company company)
        {
            var entity = await _dbContext.Companies.SingleOrDefaultAsync(x => x.Id == company.Id);

            entity.Name = company.Name;
            entity.Comment = company.Comment;
            entity.ResponsiblePersonEmail = company.ResponsiblePersonEmail;
            entity.ResponsiblePersonFIO = company.ResponsiblePersonFIO;
            entity.ResponsiblePersonPhone = company.ResponsiblePersonPhone;

            _dbContext.Companies.Update(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<ServiceActionResult> ChangeTariff(int companyId, int newTariffId)
        {
            var entity = await _dbContext.Companies.SingleOrDefaultAsync(x => x.Id == companyId);
            if (entity.NewTariffId.HasValue)
            {
                return ServiceActionResult.GetFailed("Уже запланирована смена тарифа");
            }
            var newTariff = await _dbContext.Tariffs.SingleOrDefaultAsync(x => x.Id == newTariffId);
            var result = await _balanceService.ChangeBalance(-newTariff.Price, companyId);
            if (!result.Success)
            {
                return result;
            }
            entity.NewTariffId = newTariffId;
            _dbContext.Companies.Update(entity);
            await _dbContext.SaveChangesAsync();
            return ServiceActionResult.GetSuccess();
        }

        public async Task<ServiceActionResult> ProlongAccess(int companyId)
        {
            var entity = await _dbContext.Companies
                .Include(x => x.CompanyTariff)
                .Include(x => x.Tariff)
                .SingleAsync(x => x.Id == companyId);

            if (entity.CompanyTariff == null)
            {
                _logger.LogError($"Невозможно продлить доступ компании {companyId} ('{entity.Name}'): " +
                                 $"нет информации о тарифе");
                return ServiceActionResult.GetFailed("Невозможно продлить доступ");
            }

            var result = await _balanceService.ChangeBalance(-entity.CompanyTariff.Price, companyId);
            if (!result.Success)
            {
                return result;
            }

            if (entity.PaidTo.HasValue)
            {
                entity.PaidTo = entity.PaidTo.Value.AddDays(entity.Tariff.Period);
            }
            else
            {
                entity.PaidTo = DateTimeOffset.Now.AddDays(entity.Tariff.Period);
            }

            _dbContext.Companies.Update(entity);
            await _dbContext.SaveChangesAsync();
            return ServiceActionResult.GetSuccess();
        }

        public async Task EditCompanyInfo(CompanyEditModel model)
        {
            var company = await _dbContext.Companies
                .Include(x => x.CompanyTariff)
                .SingleAsync(x => x.Id == model.Id);

            company.Comment = model.Comment;
            company.Name = model.Name;
            company.ResponsiblePersonEmail = model.ResponsiblePersonEmail;
            company.PaidTo = model.PaidTo;
            if (company.CompanyTariff != null)
            {
                company.CompanyTariff.UsersCount = model.UsersCount;
                company.CompanyTariff.EquipmentsCount = model.EquipmentsCount;
                company.CompanyTariff.ObjectsCount = model.ObjectsCount;
                company.CompanyTariff.Support = model.Support;
            }

            _dbContext.Companies.Update(company);
            await _dbContext.SaveChangesAsync();
        }
    }

    public class CompanyCard
    {
        public Company CompanyInfo { get; set; }

        public int MaxUsersCount { get; set; }

        public int CurrentUsersCount { get; set; }

        public int MaxObjectsCount { get; set; }

        public int CurrentObjectsCount { get; set; }

        public int MaxEquipmentsCount { get; set; }

        public int CurrentEquipmentsCount { get; set; }
    }
}