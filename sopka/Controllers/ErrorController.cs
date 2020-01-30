using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Helpers;
using sopka.Models;

namespace sopka.Controllers
{
    [AllowAnonymous]
    public class ErrorController : Controller
    {
        private readonly ILogger _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            var exceptionHandler = HttpContext.Features.Get<IExceptionHandlerFeature>();

            var exception = exceptionHandler?.Error;
            if (exception != null)
            {
                _logger.LogError(1, exception, exception.Message);
            }

            if (Request.IsAjaxRequest())
            {
                var result = new ServiceActionResult()
                {
                    Success = false,
                    Message = exception?.Message
                };
                return Json(result);
            }
            return View(exception);
        }

        public IActionResult Error401()
        {
            return View();
        }

        public IActionResult Error403()
        {
            return View();
        }

        public IActionResult Error404()
        {
            return View();
        }

        public IActionResult Error500()
        {
            return View();
        }
    }
}