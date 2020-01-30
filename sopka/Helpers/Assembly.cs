using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sopka.Helpers
{
	public class Assembly
	{
		public string GetAssembly()
		{
			var version = GetType().Assembly.GetName().Version.ToString();
			version = version.Substring(0, version.LastIndexOf('.'));
			return version;
		}
	}
}
