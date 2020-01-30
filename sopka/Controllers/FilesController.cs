using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sopka.Services;

namespace sopka.Controllers
{
	[Authorize]
    public class FilesController : Controller
    {
	    private readonly FileService _service;
	    private readonly ILogger<FilesController> _logger;

	    public FilesController(FileService service, ILogger<FilesController> logger)
	    {
		    _service = service;
		    _logger = logger;
	    }

        [HttpGet(Name = "List")]
        public async Task<IActionResult> List([FromQuery] int id, string type)
        {
            try
            {
                return Ok(await _service.GetFiles(id, type));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, id);
                return Ok(ex.Message);
            }
        }

        public async Task<IActionResult> Preview(int id)
		{
			try
			{
				var result = await _service.GetPreview(id);
				return File(System.IO.File.OpenRead(result.FullPath), result.ContentType, result.FileName);
			}
			catch (FileNotFoundException ex)
			{
				return NotFound(ex.Message);
			}
			catch (ArgumentException ex)
			{
				return NotFound(ex.Message);
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

	    public async Task<IActionResult> Download([FromQuery] int id)
	    {
		    try
		    {
			    var result = await _service.GetFile(id);
			    return File(System.IO.File.OpenRead(result.FullPath), result.ContentType, result.FileName);
		    }
		    catch (FileNotFoundException ex)
		    {
			    return NotFound(ex.Message);
		    }
		    catch (ArgumentException ex)
		    {
			    return NotFound(ex.Message);
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

	    public async Task<IActionResult> Info([FromQuery] int id)
	    {
		    try
		    {
			    var result = await _service.GetFile(id);
			    return Ok(new { result.ContentType, Name = result.FileName, result.PreviewId, Size = result.FileSize });
		    }
		    catch (FileNotFoundException ex)
		    {
			    return NotFound(ex.Message);
		    }
		    catch (ArgumentException ex)
		    {
			    return NotFound(ex.Message);
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
    }
}