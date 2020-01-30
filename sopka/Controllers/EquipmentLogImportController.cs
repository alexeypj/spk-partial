using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using sopka.Models;
using sopka.Services.EquipmentLogImport;

namespace sopka.Controllers
{
    public class EquipmentLogImportController : Controller
    {
        private readonly EquipmentLogImportService _importService;
        private readonly ILogger<EquipmentLogImportController> _logger;

        public EquipmentLogImportController(EquipmentLogImportService importService, ILogger<EquipmentLogImportController> logger)
        {
            _importService = importService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Index()
        {
            try
            {
                await _importService.Import(Request.Body);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обработке зарпоса на импорт логов оборудования");
#if DEBUG
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
#else
                return StatusCode(StatusCodes.Status500InternalServerError, "Внутренняя ошибка при обработки запроса");
#endif
            }
        }

    }
}