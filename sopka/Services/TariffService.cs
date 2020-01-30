using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.Filters;

namespace sopka.Services
{
    public class TariffService
    {
        private readonly SopkaDbContext _dbContext;

        public TariffService(SopkaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PaginationModel<Tariff>> GetTariffList(TariffFilter filter)
        {
            var query = _dbContext.Tariffs.AsNoTracking().AsQueryable();

            var q = filter.Query?.Trim();
            if (!string.IsNullOrEmpty(q))
            {
                query = query.Where(x => x.Name.Contains(q));
            }

            return new PaginationModel<Tariff>()
            {
                Items = (await query.Skip(filter.Skip).Take(filter.ItemsPerPage).ToListAsync()),
                Total = (await query.CountAsync())
            };
        }

        public async Task<Tariff> Store(Tariff tariff)
        {
            if (tariff.Id == 0)
            {
                _dbContext.Tariffs.Add(tariff);
                await _dbContext.SaveChangesAsync();
                return tariff;
            }
            else
            {
                var entity = await _dbContext.Tariffs.FindAsync(tariff.Id);
                entity.Name = tariff.Name;
                entity.EquipmentsCount = tariff.EquipmentsCount;
                entity.ObjectsCount = tariff.ObjectsCount;
                entity.UsersCount = tariff.UsersCount;
                entity.Support = tariff.Support;
                entity.IsActive = tariff.IsActive;
                entity.Period = tariff.Period;
                _dbContext.Tariffs.Update(entity);
                await _dbContext.SaveChangesAsync();
                return entity;
            }
        }

        public async Task<ServiceActionResult> RemoveTariff(int id)
        {
            var companies = await _dbContext.Companies.Where(x => x.TariffId == id || x.NewTariffId == id)
                .ToListAsync();
            if (companies.Any())
            {

                var result = new RemoveTariffResult()
                {
                    Companies = companies.Select(x => x.Name).ToArray(),
                    Success = false,
                };
                result.Message = $"Тарифный план используется в компаниях: {string.Join(", ", result.Companies)}";
                return result;
            }

            var tariff = await _dbContext.Tariffs.FindAsync(id);
            _dbContext.Remove(tariff);
            await _dbContext.SaveChangesAsync();
            return ServiceActionResult.GetSuccess();
        }
    }

    public class RemoveTariffResult : ServiceActionResult
    {
        public string[] Companies { get; set; }
    }

    public class TariffFilter: PaginationFilter
    {
        public string Query { get; set; }
    }
}