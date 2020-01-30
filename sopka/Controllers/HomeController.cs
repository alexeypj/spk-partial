using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Models;
using sopka.Models.ContextModels;
using sopka.Services;

namespace sopka.Controllers
{
    public class HomeController : Controller
    {
        private UserManager<AppUser> userManager;
        private InventoryService _inventoryService;
        private ILogger<HomeController> _logger;

        public HomeController(UserManager<AppUser> usrMgr, InventoryService inventoryService, ILogger<HomeController> logger)
        {
            userManager = usrMgr;
            _inventoryService = inventoryService;
            _logger = logger;
            
        }

        public IActionResult Index() => View(userManager.Users);

        

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> Data()
        {
	        try
	        {
		        var objectSummary = _inventoryService.GetSummary();
		        var counters = _inventoryService.GetCounters();
		        await Task.WhenAll(objectSummary, counters);
		        return Ok(new
		        {
					Objects = objectSummary.Result,
					Counters = counters.Result
		        });
			}
	        catch (Exception ex)
	        {
				_logger.LogError(ex.Message);
				return Error();
	        }
        }
    }
}
