using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Helpers;
using sopka.Models.DTO;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class VulnerabilitiesController : ControllerBase
    {
        private readonly VulnerabilityService _service;
        private readonly ILogger<VulnerabilitiesController> _logger;
        private readonly CurrentUser _currentUser;

        public VulnerabilitiesController(VulnerabilityService service, CurrentUser currentUser, ILogger<VulnerabilitiesController> logger)
        {
            _service = service;
            _currentUser = currentUser;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            try
            {   
                var result = await _service.Get(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> List(VulnerabilitiesFilter filter)
        {
            try
            {
                var result = await _service.GetVulnerabilities(filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFolders()
        {
            try
            {
                var result = await _service.Folders();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }   
        }

        [HttpPost]
        public async Task<IActionResult> SetStatus([FromBody] VulnerabilityModelStatus model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _service.SetStatus(model.Id, model.StatusId, _currentUser.User);
                    return Ok(result);
                }
                var errors = ModelState.GetErrors();
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Import()    
        {
            try
            {
                await _service.Import(Request.Body);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обработке зарпоса на импорт логов оборудования");
                return StatusCode(StatusCodes.Status500InternalServerError, "Внутренняя ошибка при обработки запроса");
            }
        }

        [HttpGet]
        public async Task<IActionResult> Dictionaries()
        {
            try
            {
                var result = await _service.Dictionaries();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> StoreComment([FromBody] VulnerabilityModelComment model)
        {
            Thread.Sleep(5000);
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _service.StoreComment(model.Id, model.Text, _currentUser.User?.Id);
                    return Ok(result);
                }
                var errors = ModelState.GetErrors();
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Comments(int id)
        {
            try
            {
                var result = await _service.GetComments(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> FolderContents(int id)
        {
            try
            {
                var result = await _service.GetFolderContents(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Ok(ex.Message);
            }
        }

    }
}