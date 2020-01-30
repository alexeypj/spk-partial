using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sopka.Models.Filters;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class EquipmentJournalsController : Controller
    {
        private readonly EquipmentJournalService _journalService;

        public EquipmentJournalsController(EquipmentJournalService journalService)
        {
            _journalService = journalService;
        }

        public async Task<IActionResult> Dictionaries()
        {
            var dics = await _journalService.GetDictionaries();
            return Json(dics);
        }

        public async Task<IActionResult> List(EquipmentJournalFilter filter)
        {
            var journal = await _journalService.GetJournal(filter);
            return Json(journal);
        }
    }
}