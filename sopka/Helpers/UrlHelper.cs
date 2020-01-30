using System;
using Microsoft.AspNetCore.Mvc;

namespace sopka.Helpers
{
	public static class UrlHelper
	{
		public static string AbsoluteContent(this IUrlHelper url, string contentPath)
		{
			var request = url.ActionContext.HttpContext.Request;
			return new Uri(new Uri(request.Scheme + "://" + request.Host.Value), url.Content(contentPath)).ToString();
		}
	}
}
