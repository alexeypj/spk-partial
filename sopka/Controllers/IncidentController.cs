using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;
using sopka.Models.DTO;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Models.ViewModels;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class IncidentController : Controller
    {
        private readonly IncidentService _incidentService;
        private readonly InventoryService _inventoryService;
        private readonly CurrentUser _currentUser;
        private readonly ILogger<IncidentController> _logger;
        private readonly ActionLogger _actionLogger;
		
        public IncidentController(IncidentService incidentService, InventoryService inventoryService, 
            CurrentUser currentUser, ILogger<IncidentController> logger, ActionLogger actionLogger)
        {
            _incidentService = incidentService;
            _inventoryService = inventoryService;
            _currentUser = currentUser;
            _logger = logger;
            _actionLogger = actionLogger;
        }


        public IActionResult AboutIncident()
        {
	        return View();
        }

	   public async Task<IActionResult> List(IncidentFilter filter)
	   {
		   try
           {
               var data = await _incidentService.GetIncidents(filter);

               var result = new PaginationModel<IncidentListItem>()
			   {
				   Items = data.Item1,
				   Total = data.Item2
			   };
			   return Ok(result);
		   }
		   catch (Exception ex)
		   {
			   _logger.LogError(ex.Message, filter, ex.InnerException);
			   return Ok(ex.Message);
		   }
	   }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> Store(IncidentModel incident)
        {
	        try
	        {
				if (incident != null && ModelState.IsValid)
				{
	           
		            int incidentId;
		            if (incident.Id == 0)
		            {
			            incidentId = await _incidentService.Create(incident, _currentUser.User);
                        _actionLogger.Log(LogActions.IncidentCreated, ActionEntityType.Incident,
                            incidentId.ToString(), entityTitle: incident.Title);
                    }
		            else
                    {
                        var (id, changes) = await _incidentService.Update(incident, _currentUser.User);
                        incidentId = id;
                        _actionLogger.Log(LogActions.IncidentEdited, ActionEntityType.Incident,
                            id.ToString(), entityTitle: incident.Title, parameters: changes.ToDictionary(x => x.FieldName, x => x.NewVal));
                    }
		            return Ok(incidentId);
				}

                var errors = ModelState.GetErrors();
                if (incident?.Id > 0)
                    _actionLogger.Log(LogActions.IncidentUnsuccessfulEdit, ActionEntityType.Incident,
                        parameters: new {incident, errors}, entityTitle: incident.Title, entityId: incident.Id.ToString());
                else
                    _actionLogger.Log(LogActions.IncidentUnsuccessfulCreate, ActionEntityType.Incident,
                        parameters: new {incident, errors});
                return Ok(string.Join("\n", errors));
	        }
	        catch (Exception ex)
	        {
		        _logger.LogError(ex.Message, incident, ex.InnerException);
                if (incident?.Id > 0)
                    _actionLogger.Log(LogActions.IncidentUnsuccessfulEdit, ActionEntityType.Incident,
                        parameters: new {incident, errors = ex.Message}, entityTitle: incident.Title, entityId: incident.Id.ToString());
                else
                    _actionLogger.Log(LogActions.IncidentUnsuccessfulCreate, ActionEntityType.Incident,
                        parameters: new {incident, errors = ex.Message});
		        return Ok(ex.Message);
	        }
		}

        public async Task<IActionResult> Dictionaries()
        {
            var dics = await _incidentService.GetIncidentListDictionaries();
            return Ok(dics);
        }

        public async Task<IActionResult> IncidentCreationDictionaries()
        {
            var dics = await _incidentService.GetIncidentCreationDictionaries();
            return Ok(dics);
        }

        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _incidentService.Get(id);
	        return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> Statuses()
        {
	        var result = await _incidentService.Statuses();
	        return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> SetStatus([FromBody] IncidentSetStatus model)
        {
	        if(model != null && ModelState.IsValid)
	        {
		        try
		        {
			        await _incidentService.SetStatus(model.IncidentId, model.StatusId, model.Comment, _currentUser.User);
			        return Ok(true);
		        }
		        catch (Exception ex)
		        {
					_logger.LogError(ex.Message, model, ex.InnerException);
			        return Ok(ex.Message);
		        }
	        }

	        using (var errorEnumerator = ModelState.GetEnumerator())
	        {
		        var errorResult = new List<string>();
		        while (errorEnumerator.MoveNext()) errorResult.Add(errorEnumerator.Current.Key);
		        return Ok(errorResult);
	        }
		}

        [HttpGet]
        public async Task<IActionResult> History(IncidentHistoryFilter filter)
        {
	        try
	        {
		        var result = await _incidentService.GetHistory(filter);
		        return Ok(result);
	        }
	        catch (Exception ex)
	        {
		        _logger.LogError(ex.Message, filter, ex.InnerException);
		        return Ok(ex.Message);
	        }
        }

        [HttpPost]
        public async Task<IActionResult> Statistic([FromBody] StatisticFilter filter)
        {
            var stat = await _incidentService.GetStatistic(filter);
            return Json(stat);
        }
    }

    public class StatisticFilter
    {
        public IncidentStatisticPeriod Period { get; set; }

        public IncidentStatisticGroupType GroupType { get; set; }

        public DateTimeOffset? DateFrom { get; set; }

        public DateTimeOffset? DateTo { get; set; }
    }
}