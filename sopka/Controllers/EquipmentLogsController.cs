using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models.DTO;
using sopka.Models.Enum;
using sopka.Models.EquipmentLogs.Rules;
using sopka.Models.Filters;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class EquipmentLogsController : ControllerBase
    {
        private readonly EquipmentLogsService _service;
        private readonly CurrentUser _currentUser;
        private readonly ILogger<EquipmentLogsController> _logger;
        private readonly ActionLogger _actionLogger;
        private readonly AccessControlService _accessControlService;

        public EquipmentLogsController(EquipmentLogsService service, CurrentUser currentUser, ILogger<EquipmentLogsController> logger, ActionLogger actionLogger, AccessControlService accessControlService)
        {
            _service = service;
            _currentUser = currentUser;
            _logger = logger;
            _actionLogger = actionLogger;
            _accessControlService = accessControlService;
        }

        public async Task<IActionResult> List(EquipmentLogsFilter filter)
        {
            try
            {
                var result = await _service.GetRulesList(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, filter, ex.InnerException);
                return Ok(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> Store([FromBody] Rule model)
        {
            var creation = model?.Id == 0;
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var result = await _service.Store(model, _currentUser.User);

                    _actionLogger.Log((creation ? LogActions.EquipmentLogsRuleCreated : LogActions.EquipmentLogsRuleEdited),
                        ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, model);

                    return Ok(result);
                }
                var errors = ModelState.GetErrors();

                _actionLogger.Log(creation ? LogActions.EquipmentLogsRuleUnsuccessfulCreate : LogActions.EquipmentLogsRuleUnsuccessfulUpdate,
                    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, new { model, errors });

                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, model);

                _actionLogger.Log(creation ? LogActions.EquipmentLogsRuleUnsuccessfulCreate : LogActions.EquipmentLogsRuleUnsuccessfulUpdate,
                    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, new { model, errors = ex.Message });

                return Ok(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> ChangeActivity([FromBody] EquipmentLogActivity model)
        {
            var creation = model?.Id == 0;
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var result = await _service.ChangeActivity(model.Id, model.Active, _currentUser.User);

                    //_actionLogger.Log((creation ? LogActions.EquipmentLogsRuleCreated : LogActions.EquipmentLogsRuleEdited),
                    //    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, model);

                    return Ok(result);
                }
                var errors = ModelState.GetErrors();

                //_actionLogger.Log(creation ? LogActions.EquipmentLogsRuleUnsuccessfulCreate : LogActions.EquipmentLogsRuleUnsuccessfulUpdate,
                //    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, new { model, errors });

                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, model);

                //_actionLogger.Log(creation ? LogActions.EquipmentLogsRuleUnsuccessfulCreate : LogActions.EquipmentLogsRuleUnsuccessfulUpdate,
                //    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, new { model, errors = ex.Message });

                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int id)
        {
            try
            {
                var result = await _service.Get(id);

                //_actionLogger.Log((creation ? LogActions.EquipmentLogsRuleCreated : LogActions.EquipmentLogsRuleEdited),
                //    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, model);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id);

                //_actionLogger.Log(creation ? LogActions.EquipmentLogsRuleUnsuccessfulCreate : LogActions.EquipmentLogsRuleUnsuccessfulUpdate,
                //    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, new { model, errors = ex.Message });

                return Ok(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Policy = PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> Remove([FromQuery] int id)
        {
            try
            {
                var result = await _service.Remove(id);

                //_actionLogger.Log((creation ? LogActions.EquipmentLogsRuleCreated : LogActions.EquipmentLogsRuleEdited),
                //    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, model);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id);

                //_actionLogger.Log(creation ? LogActions.EquipmentLogsRuleUnsuccessfulCreate : LogActions.EquipmentLogsRuleUnsuccessfulUpdate,
                //    ActionEntityType.EquipmentLog, model.Id.ToString(), model.Name, new { model, errors = ex.Message });

                return Ok(ex.Message);
            }
        }

    }
}