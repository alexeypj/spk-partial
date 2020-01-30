using System;
using Microsoft.AspNetCore.Http;

namespace sopka.Infrastructure.Http
{
	/// <summary>
	/// Расширение для объекта HttpContext
	/// </summary>
	public static class HttpContextExtentions
	{
		/// <summary>
		/// Является ли запрос типа Ajax
		/// </summary>
		/// <param name="request">Запрос</param>
		/// <returns></returns>
		public static bool IsAjaxRequest(this HttpRequest request)
		{
			if (request == null)
				throw new ArgumentNullException(nameof(request));

			if (request.Headers != null)
				return request.Headers["X-Requested-With"] == "XMLHttpRequest";

			return false;
		}

		/// <summary>
		/// Метод возвращает максимальный размер загружаемых файлов
		/// </summary>
		/// <returns></returns>
		public static long MultipartBodyLengthLimit(this HttpContext httpContext)
		{
			var formFeature = httpContext.Features.Get<IFormFileLengthLimit>();
			if (formFeature == null)
				return 0;

			return formFeature.Value;
		}

		/// <summary>
		/// Метод возвращает максимальный размер загружаемых файлов в Mb
		/// </summary>
		/// <returns></returns>
		public static float MultipartBodyLengthLimitMb(this HttpContext httpContext)
		{
			var formFeature = httpContext.Features.Get<IFormFileLengthLimit>();
			if (formFeature == null)
				return 0;

			return formFeature.ValueMb;
		}
	}
}
