using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.ContextModels.Directories;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class CompaniesController : Controller
    {
        private readonly CompaniesService _companiesService;
        private readonly InvoiceService _invoiceService;
        private readonly CurrentUser _currentUser;
        
        public CompaniesController(CompaniesService companiesService, InvoiceService invoiceService, CurrentUser currentUser)
        {
            _companiesService = companiesService;
            _invoiceService = invoiceService;
            _currentUser = currentUser;
        }

        // GET
        [HttpGet]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> List(CompaniesFilter filter)
        {
            var result = await _companiesService.GetCompanies(filter);
            return Json(result);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> ChangeBalance([FromBody]ChangeBalanceModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join(", ", ModelState.GetErrors());
                return Json(errors);
            }
            var invoice = await _invoiceService.CreateInvoice(model.CompanyId, model.Amount, PaymentMethod.Manual);
            await _invoiceService.PayInvoice(invoice.Id);
            var result = await _companiesService.ProlongAccess(model.CompanyId);
            if (!result.Success)
            {
                return Json("Средства зачислены, но доступ не продлен: " + result.Message);
            }
            return Json(result);
        }
        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> EditCompanyInfo([FromBody]CompanyEditModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join(", ", ModelState.GetErrors());
                return Json(errors);
            }
            await _companiesService.EditCompanyInfo(model);
            return Json(model);
        }


        [HttpGet]
        [Authorize(PermissionPolicies.CompanyUser)]
        public async Task<IActionResult> Card()
        {
            var company = await _companiesService.GetCompanyCard(_currentUser.User.CompanyId.Value);
            return Json(company);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.CompanyUser)]
        public async Task<IActionResult> StoreCard([FromBody]Company company)
        {
            company.Id = _currentUser.User.CompanyId.Value;
            var result = await _companiesService.Store(company);
            return Json(result);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.CompanyUser)]
        public async Task<IActionResult> ChangeTariff([FromBody] ChangeTariffModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join(", ", ModelState.GetErrors());
                return Json(ServiceActionResult.GetFailed(errors));
            }
            var result = await _companiesService.ChangeTariff(_currentUser.User.CompanyId.Value, model.TariffId);
            return Json(result);
        }

    }
}