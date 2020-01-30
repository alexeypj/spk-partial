using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using sopka.Infrastructure.Http;
using sopka.Models;
using sopka.Models.Options;

namespace sopka.Controllers
{
    public class SettingsController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IOptions<FormOptions> _options;
        private readonly IOptions<InstallationOptions> _installation;

        public SettingsController(IConfiguration configuration, IOptions<InstallationOptions> installation, IOptions<FormOptions> formOptions)
        {
            _configuration = configuration;
            _installation = installation;
            _options = formOptions;
        }

        public IActionResult GetSettings()
        {
            float maxFileSize = HttpContext.Features.Get<IFormFileLengthLimit>()?.ValueMb ??
                                _options.Value.MultipartBodyLengthLimit / 1024 / 1024;
            var conf = new SopkaConfiguration(_configuration, maxFileSize, _installation.Value);
            return Ok(conf.GetSettings());
        }
    }
}