using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Helpers.Authorization;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Services;

namespace sopka.Controllers
{
	/// <summary>
	/// Инвентаризация КИИ
	/// </summary>
    [Authorize]
	public class InventoryController : ControllerBase
	{

		private readonly InventoryService _service;
        private readonly ActionLogger _actionLogger;
        private readonly AccessControlService _accessControlService;
        private readonly ILogger<InventoryController> _logger;

        public InventoryController(InventoryService service, ActionLogger actionLogger, ILogger<InventoryController> logger,  AccessControlService accessControlService)
        {
            _service = service;
            _actionLogger = actionLogger;
            _accessControlService = accessControlService;
            _logger = logger;
        }

		[HttpGet]
		public async Task<IActionResult> GetObjects(InventoryFilter filter)
		{
            var result = await _service.GetObjectsList(filter);
			return Ok(result);
		}
		
		[HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
		public async Task<IActionResult> Store([FromBody] ObjectEntry model)
        {
            var creation = model?.Id == 0;
			if (model != null && ModelState.IsValid)
            {
                if (model.Id == 0)
                {
                    var checkResult = await _accessControlService.CheckForObjectsCreation();
                    if (!checkResult.Success)
                    {
                        return Ok(checkResult.Message);
                    }
                }
				var (result, changes) =  await _service.Store(model);
                if (creation)
                {
                    _actionLogger.Log(LogActions.InventoryCreated, ActionEntityType.Inventory,
                        model.Id.ToString(), model.ObjectName);
                }
                else
                {
                    _actionLogger.Log(LogActions.InventoryEdited, ActionEntityType.Inventory,
                        model.Id.ToString(), model.ObjectName, parameters: changes);
                }
                return Ok(result);
			}

			using (var errorEnumerator = ModelState.GetEnumerator())
			{
				var errorResult = new List<string>();
				while (errorEnumerator.MoveNext()) errorResult.Add(errorEnumerator.Current.Key);
                _actionLogger?.Log(creation ? LogActions.InventoryUnsuccessfulCreate : LogActions.InventoryUnsuccessfulEdit,
                    ActionEntityType.Inventory, model?.Id.ToString(), model?.ObjectName, new { model, errors = errorResult });
                return Ok(errorResult);
			}
		}

		[HttpGet]
		public async Task<IActionResult> GetEquipment(int id)
		{
			var result = await _service.GetEquipment(id);
			return Ok(result);
		}


		[HttpGet]
		public async Task<IActionResult> GetObject(int id)
		{
			var result = await _service.GetObject(id);
			return Ok(result);
		}

		[HttpGet]
		public async Task<IActionResult> GetEquipmentList(EquipmentListFilter filter)
		{
			var result = await _service.GetEquipmentList(filter);
			return Ok(new PaginationModel<EquipmentListItem>()
			{
				Items = result,
				Total = await _service.Count(filter)
			});
		}

		[HttpGet]
		public async Task<IActionResult> LoadDictionaries()
		{
			var dictionaries = await _service.LoadEquipmentDictionaries();
			return Ok(dictionaries);
		}

		[HttpGet]
		public async Task<IActionResult> LoadObjectDictionaries()
		{
			return Ok(await _service.LoadObjectDictionaries());
		}

		/// <summary>
		/// Сохранение оборудования
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		[HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
		public async Task<IActionResult> StoreEquipment([FromBody] Equipment model)
		{
            var creation = model?.Id == 0;
			if (model != null && ModelState.IsValid)
            {
                if (model.Id == 0)
                {
                    var checkResult = await _accessControlService.CheckForEquipmentCreation();
                    if (!checkResult.Success)
                    {
                        return Ok(checkResult.Message);
                    }
                }
				var result = await _service.Store(model);
                _actionLogger?.Log(creation? LogActions.EquipmentCreated:LogActions.EquipmentEdited, 
                    ActionEntityType.Equipment, model.Id.ToString(), model.Name, model);
				return Ok(result);
			}

			using (var errorEnumerator = ModelState.GetEnumerator())
			{
				var errorResult = new List<string>();
				while (errorEnumerator.MoveNext()) errorResult.Add(errorEnumerator.Current.Key);
                _actionLogger?.Log(creation? LogActions.EquipmentUnsuccessfulCreate:LogActions.EquipmentUnsuccessfulEdit, 
                    ActionEntityType.Equipment, model?.Id.ToString(), model?.Name, new {model, errors = errorResult});
				return Ok(errorResult);
			}
		}

		[HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
		public async Task<IActionResult> RemoveObject(int id)
		{
            try
            {
                await _service.RemoveObject(id);
                _actionLogger.Log(LogActions.InventoryDeleted);
                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id, ex.InnerException);
                return Ok(ex.Message);
            }
        }
	}
}