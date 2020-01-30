using System;

namespace sopka.Models.Options
{
    public class InstallationOptions
    {
        public string Type { get; set; }

        /// <summary>
        /// Относительный путь приложения ("/", "/sopka/", "/demo/" и т.д.)
        /// </summary>
        public string PublicPath { get; set; }

        public bool IsLimited => Type.Equals("demo", StringComparison.InvariantCultureIgnoreCase) ||
                                 Type.Equals("cloud", StringComparison.InvariantCultureIgnoreCase);

        public bool IsCloud => Type.Equals("cloud", StringComparison.InvariantCultureIgnoreCase);

    }
}
