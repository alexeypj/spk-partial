using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Helpers;
using sopka.Helpers.Authorization;
using sopka.Models.ContextModels;
using sopka.Models.Enum;
using sopka.Models.Filters;
using sopka.Models.ViewModels;
using sopka.Services;

namespace sopka.Controllers
{
    [Authorize]
    public class KnowledgeBaseController : Controller
    {
	    private readonly KnowledgeBaseService _service;
	    private readonly ILogger _logger;
	    private readonly CurrentUser _currentUser;
        private readonly ActionLogger _actionLogger;
	    
		public KnowledgeBaseController(KnowledgeBaseService service, CurrentUser currentUser, 
            ILogger<KnowledgeBaseController> logger, ActionLogger actionLogger)
	    {
		    _service = service;
		    _logger = logger;
            this._actionLogger = actionLogger;
            _currentUser = currentUser;
	    }

        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
	    public async Task<IActionResult> StoreFolder([FromBody] ArticleFolder folder)
        {
            var creation = folder.Id == 0;
		    try
		    {
			    if (folder != null && ModelState.IsValid)
			    {
				    var result = await _service.Store(folder);
                    _actionLogger?.Log((creation?LogActions.KnowledgeBaseArticleFolderCreated:LogActions.KnowledgeBaseArticleFolderEdited), 
                        ActionEntityType.ArticleFolder, folder.Id.ToString(), folder.Title, folder);
                    return Ok(result);
			    }
                var errors = ModelState.GetErrors();
                _actionLogger?.Log((creation ? LogActions.KnowledgeBaseArticleFolderUnsuccessfulCreate : LogActions.KnowledgeBaseArticleFolderUnsuccessfulEdit),
                    ActionEntityType.ArticleFolder, folder.Id.ToString(), folder.Title, new { folder, errors });
                return Ok(string.Join("\n", errors));
            }
            catch (Exception ex)
		    {
			    _logger.LogError(ex.Message, folder);
                _actionLogger?.Log((creation ? LogActions.KnowledgeBaseArticleFolderUnsuccessfulCreate : LogActions.KnowledgeBaseArticleFolderUnsuccessfulEdit),
                    ActionEntityType.ArticleFolder, folder.Id.ToString(), folder.Title, new { folder, errors = ex.Message });
			    return Ok(ex.Message);
		    }
	    }

	    public async Task<IActionResult> Folders()
	    {
		    try
		    {
			    var result = await _service.GetFolders();
			    return Ok(result);
		    }
		    catch (Exception ex)
		    {
			    _logger.LogError(ex.Message);
			    return Ok(ex.Message);
		    }
	    }

	    public async Task<IActionResult> Dictionaries()
	    {
		    try
		    {
			    var result = await _service.LoadDictionaries();
			    return Ok(result);
		    }
		    catch (Exception ex)
		    {
			    _logger.LogError(ex.Message);
			    return Ok(ex.Message);
			}
	    }

		[HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
	    public async Task<IActionResult> Store(ArticleModel model)
        {
            var creation = model.Id == 0;
			try
			{
				if (model != null && ModelState.IsValid)
				{
					var result = await _service.Store(model, _currentUser.User.Id);
                    _actionLogger?.Log((creation ? LogActions.KnowledgeBaseArticleCreated : LogActions.KnowledgeBaseArticleEdited),
                        ActionEntityType.Article, model.Id.ToString(), model.Title, model);
                    return Ok(result);
				}
                var errors = ModelState.GetErrors();
                _actionLogger?.Log(creation ? LogActions.KnowledgeBaseArticleUnsuccessfulCreate : LogActions.KnowledgeBaseArticleUnsuccessfulEdit,
                    ActionEntityType.Article, model.Id.ToString(), model.Title, new { model, errors });
                return Ok(string.Join("\n", errors));
			}
            catch (Exception ex)
			{
				_logger.LogError(ex.Message, model);
                _actionLogger?.Log(creation ? LogActions.KnowledgeBaseArticleUnsuccessfulCreate : LogActions.KnowledgeBaseArticleUnsuccessfulEdit,
                    ActionEntityType.Article, model.Id.ToString(), model.Title, new { model, errors = ex.Message });
				return Ok(ex.Message);
			}
		}

	    [HttpGet]
	    public async Task<IActionResult> GetArticle(int id)
	    {
		    try
		    {
			    return Ok(await _service.GetArticle(id));
		    }
		    catch (Exception ex)
		    {
			    _logger.LogError(ex.Message, id);
			    return Ok(ex.Message);
			}
	    }


	    [HttpGet]
	    public async Task<IActionResult> ArticlesList(KbFilter filter)
        {
            try
            {
                return Ok(await _service.Articles(filter));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, filter);
                return Ok(ex.Message);
            }
	    }

		[HttpGet]
		public async Task<IActionResult> RelatedArticles([FromQuery] int incidentId, string excludeArticles) 
		{
			try
            {
                var excluded = new List<int>();
                if (string.IsNullOrEmpty(excludeArticles) == false && excludeArticles.Length > 2)
                {
                    var ids = excludeArticles.Substring(1, excludeArticles.Length - 2).Split(",");
                    foreach (var id in ids)
                    {
                        if (int.TryParse(id, out int parsedId))
                        {
                            excluded.Add(parsedId);
                        }
                    }
                }
			    return Ok(await _service.GetRelatedArticles(incidentId, excluded.ToArray()));
		    }
		    catch (Exception ex)
		    {
			    _logger.LogError(ex.Message, incidentId);
			    return Ok(ex.Message);
		    }
		}

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> AttachIncident([FromBody] KbIncidentAttachViewModel model)
        {
            try
            {
                var result = await _service.AttachIncident(model.ArticleId, model.IncidentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, model);
                return Ok(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> DetachIncident([FromBody] KbIncidentAttachViewModel model)
        {
            try
            {
                var result = await _service.DetachIncident(model.ArticleId, model.IncidentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, model);
                return Ok(ex.Message);
            }
        }


        [HttpGet]
        public async Task<IActionResult> Preview([FromQuery] int id)
        {
            try
            {
                var result = await _service.GetPreview(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id);
#if DEBUG
                return Ok(ex.Message);
#else
                return StatusCode(500);
#endif
            }
        }

        [HttpGet]
        public async Task<IActionResult> AttachedArticles([FromQuery] int id)
        {
            try
            {
                var result = await _service.GetAttachedArticles(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id);
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> AttachedIncidents([FromQuery] int id)
        {
            try
            {
                var result = await _service.GetAttachedIncidents(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id);
                return Ok(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(PermissionPolicies.SuperAdminOrPaidCompany)]
        public async Task<IActionResult> Remove(int id)
        {
            try
            {
                var result = await _service.RemoveIncident(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id);
                return Ok(ex.Message);
            }
        }

    }
}