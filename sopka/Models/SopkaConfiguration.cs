using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using sopka.Models.Options;

namespace sopka.Models
{
    public class SopkaSettings
    {
        public LogoOptions Logo { get; set; }
        public float MaxFileSize { get; set; }
        public bool IsLimited { get; set; }
        public bool IsDebug { get; set; }
    }

    public class SopkaConfiguration
    {
        private IConfiguration _configuration;
        private readonly float _maxFileSize;
        private readonly InstallationOptions _installation;

        public SopkaConfiguration(IConfiguration configuration, float maxFileSize, InstallationOptions installation)
        {
            _configuration = configuration;
            _maxFileSize = maxFileSize;
            _installation = installation;
        }

        public SopkaSettings GetSettings()
        {
            var settings = _configuration.GetSection("Installation:Logo").Get<List<LogoOptions>>();
            var logo = settings.FirstOrDefault(x => x.PortalType == _installation.Type);
            if (logo == null)
            {
                logo = settings.FirstOrDefault(x =>
                    x.PortalType.Equals("default", StringComparison.InvariantCultureIgnoreCase));
            }

            var result = new SopkaSettings
            {
                Logo = logo,
                MaxFileSize = _maxFileSize,
                IsLimited = _installation.IsLimited,
                IsDebug = false
            };
#if DEBUG
            result.IsDebug = true;
#endif
            return result;
        }
    }
}
