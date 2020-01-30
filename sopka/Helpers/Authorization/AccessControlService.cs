using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Services;

namespace sopka.Helpers.Authorization
{
    public class AccessControlService
    {
        private readonly CurrentUser _currentUser;
        private readonly SopkaDbContext _dbContext;

        public AccessControlService(CurrentUser currentUser, SopkaDbContext dbContext)
        {
            _currentUser = currentUser;
            _dbContext = dbContext;
        }

        public bool HasAccess(IOwnedByCompany resource)
        {
            if (!_currentUser.IsAuthenticated)
            {
                return false;
            }

            if (!_currentUser.IsCompanyMember)
            {
                return true;
            }


            if (!resource.CompanyId.HasValue)
            {
                return false;
            }

            return _currentUser.User.CompanyId == resource.CompanyId;
        }

        private async Task<Tariff> GetTariff()
        {
            return await _dbContext.Tariffs.SingleAsync(x => x.Id == _currentUser.User.Company.TariffId);
        }

        public async Task<ServiceActionResult> CheckForUserCreation()
        {
            var (terminate, result) = CommonChecks();
            if (terminate)
            {
                return result;
            }

            var tariff = await GetTariff();
            if (tariff.UsersCount == 0)
            {
                return ServiceActionResult.GetSuccess();
            }
            if (await _dbContext.Users.CountAsync(x => x.CompanyId == _currentUser.User.CompanyId) < tariff.UsersCount)
            {
                return ServiceActionResult.GetSuccess();
            }
            return ServiceActionResult.GetFailed("Превышен лимит на количество зарегистрированных пользователей");
        }

        public async Task<ServiceActionResult> CheckForObjectsCreation()
        {
            var (terminate, result) = CommonChecks();
            if (terminate)
            {
                return result;
            }

            var tariff = await GetTariff();
            if (tariff.ObjectsCount == 0)
            {
                return ServiceActionResult.GetSuccess();
            }
            if (await _dbContext.Objects.CountAsync(x => x.CompanyId == _currentUser.User.CompanyId) < tariff.ObjectsCount)
            {
                return ServiceActionResult.GetSuccess();
            }
            return ServiceActionResult.GetFailed("Превышен лимит на количество объектов компании, зарегистрированных в системе");
        }

        public async Task<ServiceActionResult> CheckForEquipmentCreation()
        {
            var (terminate, result) = CommonChecks();
            if (terminate)
            {
                return result;
            }

            var tariff = await GetTariff();
            if (tariff.EquipmentsCount == 0)
            {
                return ServiceActionResult.GetSuccess();
            }
            if (await _dbContext.Equipment.CountAsync(x => x.CompanyId == _currentUser.User.CompanyId) < tariff.EquipmentsCount)
            {
                return ServiceActionResult.GetSuccess();
            }
            return ServiceActionResult.GetFailed("Превышен лимит на количество оборудования в компании, зарегистрированного в системе");
        }

        private (bool, ServiceActionResult) CommonChecks()
        {
            if (!_currentUser.IsCompanyMember)
            {
                return (true, ServiceActionResult.GetSuccess());
            }

            if (!_currentUser.IsPaidCompany)
            {
                return (true, ServiceActionResult.GetFailed("Доступ не оплачен"));
            }

            return (false, null);
        }
    }
}