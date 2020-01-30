using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using sopka.Helpers;
using sopka.Models;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class LogActionController: Controller
    {
        private readonly ActionLogger _actionLogger;
        private readonly ILogger<LogActionController> _logger;

        private readonly LogActionService _logActionService;

        public LogActionController(ActionLogger actionLogger, ILogger<LogActionController> logger, LogActionService logActionService)
        {
            _actionLogger = actionLogger;
            _logger = logger;
            _logActionService = logActionService;
        }

        [HttpPost]
        public async void Log(string actionName, ActionEntityType? entityType, 
            string entityId, string additionalParams, string entityTitle)
        {
            JObject logParameters = null;
            try
            {
                logParameters = string.IsNullOrEmpty(additionalParams) ? null : JObject.Parse(additionalParams);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Для логирования клиентского действия переданы параметры в неверном формате " +
                                    $"({actionName}:{additionalParams})");
            }
            _actionLogger.Log(actionName, entityType, entityId, entityTitle, logParameters);
        }

        [HttpGet]
        [Authorize(Roles = Roles.SystemOrCompanyAdmin)]
        public async Task<IActionResult> Dictionaries()
        {
            var dics = await _logActionService.GetDictionaries();
            return Json(dics);
        }

        [HttpGet]
        [Authorize(Roles = Roles.SystemOrCompanyAdmin)]
        public async Task<IActionResult> GetLogs(LogActionFilter filter)
        {
            var result = await _logActionService.GetLogs(filter);
            return Json(result);
        }

    }

    public class LogActionFilter: PaginationFilter, ISortFilter
    {
        public LogActionFilter()
        {
            DateTo = DateTimeOffset.Now;
            DateFrom = DateTo.AddHours(-1);
        }

        public string UserId { get; set; }

        public string ActionName { get; set; }

        public bool UsePeriod { get; set; }

        public DateTimeOffset DateFrom { get; set; }

        public DateTimeOffset DateTo { get; set; }

        public int? SessionId { get; set; }
        
        public DateTimeOffset? Date { get; set; }

        public bool? IsMainAction { get; set; }

        public ActionEntityType? EntityType { get; set; }
        public string SortColumn { get; set; }
        public Direction SortDirection { get; set; }
    }
}