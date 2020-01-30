using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Models.Enum;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class TariffsController: Controller
    {
        private readonly SopkaDbContext _dbContext;
        private readonly TariffService _tariffService;
        private readonly ActionLogger _actionLogger;

        public TariffsController(SopkaDbContext dbContext, TariffService tariffService, ActionLogger actionLogger)
        {
            _dbContext = dbContext;
            _tariffService = tariffService;
            _actionLogger = actionLogger;
        }

        [AllowAnonymous]
        public async Task<IActionResult> List()
        {
            var tariffs = await _dbContext.Tariffs
                .AsNoTracking()
                .Where(x => x.IsActive)
                .ToListAsync();
            return Json(tariffs);
        }

        [HttpGet]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> ListFiltered(TariffFilter filter)
        {
            var tariffs = await _tariffService.GetTariffList(filter);
            return Ok(tariffs);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> Store([FromBody]Tariff tariff)
        {
            try
            {
                if (tariff != null && ModelState.IsValid)
                {

                    var result = await _tariffService.Store(tariff);
                    return Ok(result);
                }
                var errors = ModelState.GetErrors();
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                return Ok(ex.GetBaseException().Message);
            }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveTariff(int id)
        {
            var result = await _tariffService.RemoveTariff(id);
            return Json(result);
        }


    }
}