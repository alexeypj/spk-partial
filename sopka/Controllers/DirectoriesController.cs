using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
    public class DirectoriesController : Controller
    {
	    private readonly DirectoriesService _service;
        private readonly ActionLogger _actionLogger;
        private readonly ILogger<DirectoriesController> _logger;

	    public DirectoriesController(DirectoriesService service, ActionLogger actionLogger, ILogger<DirectoriesController> logger)
        {
            _service = service;
            _actionLogger = actionLogger;
            _logger = logger;
        }

        // GET: Directories
        public ActionResult Index()
        {
            return View();
        }

		[HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentType([FromBody] EquipmentDirectory model)
        {
            var creation = model?.Id == 0;
	        try
	        {
				if (model != null && ModelState.IsValid)
				{
					var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryEquipmentTypesCreated : LogActions.DirectoryEquipmentTypesEdited,
                        ActionEntityType.DictionaryEquipmentTypes, model.Id.ToString(), model.Title, model);
					return Ok(entity);
				}
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryEquipmentTypesUnsuccessfulCreate : LogActions.DirectoryEquipmentTypesUnsuccessfulEdit,
                    ActionEntityType.DictionaryEquipmentTypes, model?.Id.ToString(), model?.Title, new {model, errors});
                return Ok(string.Join("\n", errors));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryEquipmentTypesUnsuccessfulCreate : LogActions.DirectoryEquipmentTypesUnsuccessfulEdit,
                    ActionEntityType.DictionaryEquipmentTypes, model?.Id.ToString(), model?.Title, new { model, errors = ex.Message });
                return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentPlatform([FromBody] PlatformDirectory model)
        {
            var creation = model?.Id == 0;
            try
            {
				if (model != null && ModelState.IsValid)
				{
					var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryPlatformsCreated : LogActions.DirectoryPlatformsEdited,
                        ActionEntityType.DictionaryPlatforms, model.Id.ToString(), model.Product, model);
                    return Ok(entity);
				}
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryPlatformsUnsuccessfulCreate : LogActions.DirectoryPlatformsUnsuccessfulEdit,
                    ActionEntityType.DictionaryPlatforms, model?.Id.ToString(), model?.Product, new { model, errors });
                return Ok(string.Join("\n", errors));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryPlatformsUnsuccessfulCreate : LogActions.DirectoryPlatformsUnsuccessfulEdit,
                    ActionEntityType.DictionaryPlatforms, model?.Id.ToString(), model?.Product, new { model, errors = ex.Message });
		        return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentProcessor([FromBody] CPUDirectory model)
        {
            var creation = model?.Id == 0;
	        try
	        {
		        if (model != null && ModelState.IsValid)
		        {
			        var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryCPUCreated : LogActions.DirectoryCPUEdited,
                        ActionEntityType.DictionaryCPU, model.Id.ToString(), model.Product, model);
			        return Ok(entity);
		        }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryCPUUnsuccessfulCreate : LogActions.DirectoryCPUUnsuccessfulEdit,
                    ActionEntityType.DictionaryCPU, model?.Id.ToString(), model?.Product, new { model, errors });
		        return Ok(string.Join("\n", errors));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryCPUUnsuccessfulCreate : LogActions.DirectoryCPUUnsuccessfulEdit,
                    ActionEntityType.DictionaryCPU, model?.Id.ToString(), model?.Product, new { model, errors = ex.Message });
		        return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentMemory([FromBody] RAMDirectory model)
        {
            var creation = model?.Id == 0;
	        try
	        {
		        if (model != null && ModelState.IsValid)
		        {
			        var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryRAMCreated : LogActions.DirectoryRAMEdited,
                        ActionEntityType.DictionaryRAM, model.Id.ToString(), model.Title, model);
                    return Ok(entity);
		        }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryRAMUnsuccessfulCreate : LogActions.DirectoryRAMUnsuccessfulEdit,
                    ActionEntityType.DictionaryRAM, model?.Id.ToString(), model?.Title, new { model, errors });
		        return Ok(string.Join("\n", ModelState.GetErrors()));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryRAMUnsuccessfulCreate : LogActions.DirectoryRAMUnsuccessfulEdit,
                    ActionEntityType.DictionaryRAM, model?.Id.ToString(), model?.Title, new { model, errors = ex.Message });
		        return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentHDD([FromBody] HDDDirectory model)
        {
            var creation = model?.Id == 0;
	        try
	        {
				if (model != null && ModelState.IsValid)
				{
					var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryHDDCreated : LogActions.DirectoryHDDEdited,
                        ActionEntityType.DictionaryHDD, model.Id.ToString(), model.Title, model);
					return Ok(entity);
				}
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryHDDUnsuccessfulCreate : LogActions.DirectoryHDDUnsuccessfulEdit,
                    ActionEntityType.DictionaryHDD, model?.Id.ToString(), model?.Title, new { model, errors });
				return Ok(string.Join("\n", errors));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryHDDUnsuccessfulCreate : LogActions.DirectoryHDDUnsuccessfulEdit,
                    ActionEntityType.DictionaryHDD, model?.Id.ToString(), model?.Title, new { model, errors = ex.Message });
                return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentNetworkAdapter([FromBody] NetworkAdapterDirectory model)
        {
            var creation = model?.Id == 0;
	        try
	        {
				if (model != null && ModelState.IsValid)
				{
					var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryNetworkAdaptersCreated : LogActions.DirectoryNetworkAdaptersEdited,
                        ActionEntityType.DictionaryNetworkAdapters, model.Id.ToString(), model.Title, model);
					return Ok(entity);
				}
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryNetworkAdaptersUnsuccessfulCreate : LogActions.DirectoryNetworkAdaptersUnsuccessfulEdit,
                    ActionEntityType.DictionaryNetworkAdapters, model?.Id.ToString(), model?.Title, new { model, errors });
                return Ok(string.Join("\n", errors));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryNetworkAdaptersUnsuccessfulCreate : LogActions.DirectoryNetworkAdaptersUnsuccessfulEdit,
                    ActionEntityType.DictionaryNetworkAdapters, model?.Id.ToString(), model?.Title, new { model, errors = ex.Message });
		        return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentSoftware([FromBody] SoftDirectory model)
        {
            var creation = model?.Id == 0;
	        try
	        {
				if (model != null && ModelState.IsValid)
				{
					var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectorySoftwareCreated : LogActions.DirectorySoftwareEdited,
                        ActionEntityType.DictionarySoftware, model.Id.ToString(), model.Product, model);
					return Ok(entity);
				}
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectorySoftwareUnsuccessfulCreate : LogActions.DirectorySoftwareUnsuccessfulEdit,
                    ActionEntityType.DictionarySoftware, model?.Id.ToString(), model?.Product, new { model, errors });
                return Ok(string.Join("\n", errors));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectorySoftwareUnsuccessfulCreate : LogActions.DirectorySoftwareUnsuccessfulEdit,
                    ActionEntityType.DictionarySoftware, model?.Id.ToString(), model?.Product, 
                    new { model, errors = ex.Message });
		        return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateEquipmentOS([FromBody] OSDirectory model)
        {
            var creation = model?.Id == 0;
	        try
	        {
				if (model != null && ModelState.IsValid)
				{
					var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryOSCreated : LogActions.DirectoryOSEdited,
                        ActionEntityType.DictionaryOS, model.Id.ToString(), model.Product, model);
					return Ok(entity);
				}
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryOSUnsuccessfulCreate : LogActions.DirectoryOSUnsuccessfulEdit,
                    ActionEntityType.DictionaryOS, model?.Id.ToString(), model?.Product, new { model, errors });
                return Ok(string.Join("\n", errors));
			}
	        catch (Exception ex)
	        {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryOSUnsuccessfulCreate : LogActions.DirectoryOSUnsuccessfulEdit,
                    ActionEntityType.DictionaryOS, model?.Id.ToString(), model?.Product, 
                    new { model, errors = ex.Message });
		        return Ok(ex.Message);
	        }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateObjectType([FromBody] ObjectDirectory model)
        {
            var creation = model?.Id == 0;
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryObjectTypesCreated : LogActions.DirectoryObjectTypesEdited,
                        ActionEntityType.DictionaryObjects, model.Id.ToString(), model.Title, model);
                    return Ok(entity);
                }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryObjectTypesUnsuccessfulCreate : LogActions.DirectoryObjectTypesUnsuccessfulEdit,
                    ActionEntityType.DictionaryObjects, model?.Id.ToString(), model?.Title, new {model, errors});
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryObjectTypesUnsuccessfulCreate : LogActions.DirectoryObjectTypesUnsuccessfulEdit,
                    ActionEntityType.DictionaryObjects, model?.Id.ToString(), model?.Title, new {model, errors = ex.Message});
                return Ok(ex.Message);
            }
        }


        public async Task<IActionResult> GetObjectTypes(ObjectTypesFilter filter)
        {
            var objects = await _service.GetObjectTypes(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveObjectType(int id)
        {
            var result = await _service.RemoveObjectType(id);
            return Json(result);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateBranch([FromBody] BranchDirectory model)
        {
            var creation = model?.Id == 0;
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryBranchesCreated : LogActions.DirectoryBranchesEdited,
                        ActionEntityType.DictionaryBranches, model.Id.ToString(), model.Title, model);
                    return Ok(entity);
                }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryBranchesUnsuccessfulCreate : LogActions.DirectoryBranchesUnsuccessfulEdit,
                    ActionEntityType.DictionaryBranches, model?.Id.ToString(), model?.Title, new {model, errors});
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryBranchesUnsuccessfulCreate : LogActions.DirectoryBranchesUnsuccessfulEdit,
                    ActionEntityType.DictionaryBranches, model?.Id.ToString(), model?.Title, new {model, errors = ex.Message});
                return Ok(ex.Message);
            }
        }

        public async Task<IActionResult> GetBranches(BranchesFilter filter)
        {
            var objects = await _service.GetBranches(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveBranch(int id)
        {
            var result =await _service.RemoveBranch(id);
            return Json(result);

        }

        public async Task<IActionResult> GetEquipmentTypes(EquipmentTypesFilter filter)
        {
            var objects = await _service.GetEquipmentTypes(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveEquipmentType(int id)
        {
            var result = await _service.RemoveEquipmentType(id);
            return Json(result);
        }


        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateAttackType([FromBody] AttackDirectory model)
        {
            var creation = model?.Id == 0;
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryAttackTypesCreated : LogActions.DirectoryAttackTypesEdited,
                        ActionEntityType.DictionaryAttackTypes, model.Id.ToString(), model.Title, model);
                    return Ok(entity);
                }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryAttackTypesUnsuccessfulCreate : LogActions.DirectoryAttackTypesUnsuccessfulEdit,
                    ActionEntityType.DictionaryAttackTypes, model?.Id.ToString(), model?.Title, new {model, errors});
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryAttackTypesUnsuccessfulCreate : LogActions.DirectoryAttackTypesUnsuccessfulEdit,
                    ActionEntityType.DictionaryAttackTypes, model?.Id.ToString(), model?.Title, new { model, errors = ex.Message });
                return Ok(ex.Message);
            }
        }

        public async Task<IActionResult> GetAttackTypes(AttackTypesFilter filter)
        {
            var objects = await _service.GetAttackTypes(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveAttackType(int id)
        {
            var result = await _service.RemoveAttackType(id);
            return Json(result);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateRaid([FromBody] RAIDDirectory model)
        {
            var creation = model?.Id == 0;
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.DirectoryRaidCreated : LogActions.DirectoryRaidEdited,
                        ActionEntityType.DictionaryRaid, model.Id.ToString(), model.Title, model);
                    return Ok(entity);
                }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryRaidUnsuccessfulCreate : LogActions.DirectoryRaidUnsuccessfulEdit,
                    ActionEntityType.DictionaryRaid, model?.Id.ToString(), model?.Title, new { model, errors });
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _actionLogger?.Log(
                    creation ? LogActions.DirectoryRaidUnsuccessfulCreate : LogActions.DirectoryRaidUnsuccessfulEdit,
                    ActionEntityType.DictionaryRaid, model?.Id.ToString(), model?.Title, new { model, errors = ex.Message });
                return Ok(ex.Message);
            }
        }

        public async Task<IActionResult> GetRaid(RaidFilter filter)
        {
            var objects = await _service.GetRaid(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveRaid(int id)
        {
            var result = await _service.RemoveRaid(id);
            return Json(result);
        }

        public async Task<IActionResult> GetOS(OSFilter filter)
        {
            var objects = await _service.GetOS(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveOS(int id)
        {
            var result = await _service.RemoveOS(id);
            return Json(result);
        }

        public async Task<IActionResult> GetSoftware(SoftwareFilter filter)
        {
            var objects = await _service.GetSoftware(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveSoftware(int id)
        {
            var result = await _service.RemoveSoftware(id);
            return Json(result);
        }

        public async Task<IActionResult> GetPlatforms(PlatformFilter filter)
        {
            var objects = await _service.GetPlatforms(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemovePlatform(int id)
        {
            var result = await _service.RemovePlatform(id);
            return Json(result);
        }

        public async Task<IActionResult> GetProcessors(ProcessorFilter filter)
        {
            var objects = await _service.GetProcessors(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveProcessor(int id)
        {
            var result = await _service.RemoveProcessor(id);
            return Json(result);
        }

        public async Task<IActionResult> GetHDD(HDDFilter filter)
        {
            var objects = await _service.GetHDD(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveHDD(int id)
        {
            var result = await _service.RemoveHDD(id);
            return Json(result);
        }

        public async Task<IActionResult> GetRAM(RAMFilter filter)
        {
            var objects = await _service.GetRAM(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveRAM(int id)
        {
            var result = await _service.RemoveRAM(id);
            return Json(result);
        }

        public async Task<IActionResult> GetNetworkAdapters(NetworkAdapterFilter filter)
        {
            var objects = await _service.GetNetworkAdapters(filter);
            return Json(objects);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveNetworkAdapter(int id)
        {
            var result = await _service.RemoveNetworkAdapter(id);
            return Json(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetIncidentCriticalityDictionary()
        {
            var result = await _service.GetIncidentCriticalityDictionary();
            return Json(result);
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateCriticality([FromBody]IncidentCriticality model)
        {
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        LogActions.IncidentCriticalityFolderCreated,
                        ActionEntityType.IncidentCriticality, model.Id.ToString(), model.Criticality, model);
                    return Ok(entity);
                }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    LogActions.IncidentCriticalityUnsuccessfulCreate,
                    ActionEntityType.IncidentCriticality, model?.Id.ToString(), model?.Criticality, new { model, errors });
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _actionLogger?.Log(LogActions.IncidentCriticalityUnsuccessfulCreate,
                    ActionEntityType.IncidentCriticality, model?.Id.ToString(), model?.Criticality, new { model, errors = ex.Message });
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetEquipmentLogsSeverity()
        {
            try
            {
                var result = await _service.GetEquipmentLogSeverity();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.GetBaseException().Message, ex);
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSeveritySynonyms(EquipmentLogSeverityFilter filter)
        {
            try
            {
                var result = await _service.FindEquipmentLogSeverities(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                var message = ex.GetBaseException().Message;
                _logger.LogError(message, ex);
                return Ok(message);
            }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateSeveritySynonym([FromBody] SeveritySynonymModel model)
        {
            var creation = model?.OldSeverityId.HasValue != true;
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var entity = await _service.Store(model);
                    _actionLogger?.Log(
                        creation ? LogActions.EquipmentLogSeverityCreated : LogActions.EquipmentLogSeverityEdited,
                        ActionEntityType.EquipmentLogSeverity, entity.SeverityId.ToString(), entity.SeverityTitle, model);
                    return Ok(entity);
                }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(
                    creation ? LogActions.EquipmentLogSeverityUnsuccessfulCreate : LogActions.EquipmentLogSeverityUnsuccessfulEdit,
                    ActionEntityType.EquipmentLogSeverity, model?.NewSeverityId.ToString(), parameters: new {model, errors});
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _actionLogger?.Log(
                    creation ? LogActions.EquipmentLogSeverityUnsuccessfulCreate : LogActions.DirectoryAttackTypesUnsuccessfulEdit,
                    ActionEntityType.EquipmentLogSeverity, model?.NewSeverityId.ToString(), parameters: new { model, errors = ex.Message });
                var message = ex.GetBaseException().Message;
                _logger.LogError(message, ex);
                return Ok(message);
            }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> CreateSeverity([FromBody] EquipmentLogSeverity model)
        {
            try
            {
                if (model != null && ModelState.IsValid)
                {
                    var entity = await _service.Store(model);
                    return Ok(entity);
                }
                var errors = ModelState.GetErrors();
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                var message = ex.GetBaseException().Message;
                _logger.LogError(message, ex);
                return Ok(message);
            }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdmin)]
        public async Task<IActionResult> RemoveSeveritySynonym([FromBody]EquipmentLogSeveritySynonym model)
        {
            var result = await _service.RemoveSeveritySynonym(model);
            return Json(result);
        }

    }

    public class SeveritySynonymModel
    {
        public int? OldSeverityId { get; set; }

        public string OldSynonym { get; set; }

        public int NewSeverityId { get; set; }

        public string NewSynonym { get; set; }
    }
}