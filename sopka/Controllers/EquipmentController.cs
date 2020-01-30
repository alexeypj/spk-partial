using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Helpers.Authorization;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class EquipmentController : ControllerBase
    {
        private readonly EquipmentService _equipmentService;
        private readonly InventoryService _inventoryService;
        private readonly ActionLogger _actionLogger;
        private readonly ILogger<EquipmentController> _logger;

        public EquipmentController(EquipmentService equipmentService, ILogger<EquipmentController> logger, ActionLogger actionLogger, InventoryService inventoryService)
        {
            _equipmentService = equipmentService;
            _inventoryService = inventoryService;
            _logger = logger;
            _actionLogger = actionLogger;
        }

        public async Task<IActionResult> Find(EquipmentFilter filter)
        {
            var result = await _equipmentService.Find(filter);
            return Ok(result);
        }

        public async Task<IActionResult> FindByColumn(EquipmentFilterByColumn filter)
        {
	        var result = await _equipmentService.Find(filter);
	        return Ok(result);
        }

        public async Task<IActionResult> GetDictionaries()
        {
            var dics = await _inventoryService.LoadEquipmentDictionaries();
            return Ok(dics);
        }


        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> Remove(int id)
        {
            try
            {
                await Task.WhenAll(_inventoryService.RemoveEquipment(id),
                    _actionLogger.Log(LogActions.EquipmentDeleted));
                return Ok(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id, ex.InnerException);
                return Ok(ex.Message);
            }
        }

    }
}