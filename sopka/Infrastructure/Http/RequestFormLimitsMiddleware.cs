using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using sopka.Models;
using sopka.Models.Options;

namespace sopka.Infrastructure.Http
{
	/// <summary>
	/// Класс, для обработки ошибок превышения максимального размера загружаемого файла в рамках текущего канала обработки запросов
	/// </summary>
	public class RequestFormLimitsMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly IOptions<FormOptions> _formOptions;
		private readonly IOptions<FileServiceOptions> _options;
		private readonly ILogger _logger;

        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="next"></param>
        /// <param name="formOptions">Параметры форм</param>
        /// <param name="options">Параметры приложения</param>
        /// <param name="loggerFactory">Логгер</param>
        public RequestFormLimitsMiddleware(
			RequestDelegate next,
			IOptions<FormOptions> formOptions,
			IOptions<FileServiceOptions> options,
			ILoggerFactory loggerFactory)
		{
			_next = next;
			_formOptions = formOptions;
            _options = options;
			_logger = loggerFactory.CreateLogger<RequestFormLimitsMiddleware>();
		}

		/// <summary>
		/// Вызов обработчика в рамках текущего канала обработки запросов
		/// </summary>
		/// <param name="httpContext">Текущий http-контекст</param>
		/// <returns></returns>
		public async Task Invoke(HttpContext httpContext)
		{
			if (httpContext.User.Identity.IsAuthenticated)
			{
				if (httpContext.User.IsInRole(Roles.Admin))
                {
					var formOptions = new FormOptions
					{
						BufferBody = _formOptions.Value.BufferBody,
						MemoryBufferThreshold = _formOptions.Value.MemoryBufferThreshold,
						BufferBodyLengthLimit = _formOptions.Value.BufferBodyLengthLimit,
						KeyLengthLimit = _formOptions.Value.KeyLengthLimit,
						ValueCountLimit = _formOptions.Value.ValueCountLimit,
						ValueLengthLimit = int.MaxValue,
						MultipartBoundaryLengthLimit = _formOptions.Value.MultipartBoundaryLengthLimit,
						MultipartBodyLengthLimit = int.MaxValue,
						MultipartHeadersCountLimit = _formOptions.Value.MultipartHeadersCountLimit,
						MultipartHeadersLengthLimit = _formOptions.Value.MultipartHeadersLengthLimit,
					};

					httpContext.Features.Set<IFormFeature>(new FormFeature(httpContext.Request, formOptions));
					httpContext.Features.Set<IFormFileLengthLimit>(new FormFileLengthLimit(int.MaxValue));
				}
				else
					httpContext.Features.Set<IFormFileLengthLimit>(new FormFileLengthLimit(_formOptions.Value.MultipartBodyLengthLimit));
			}

			try
			{
				await _next.Invoke(httpContext);
			}
			catch (InvalidDataException exc)
			{
				if (exc.Message.IndexOf("Multipart body length limit") > -1)
				{
					httpContext.Response.ContentType = "text/plain";
					httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
					httpContext.Response.HttpContext.Features.Get<IHttpResponseFeature>().ReasonPhrase = "File too large";
					var mbSize = _options.Value.MaxUploadFileSize / 1024 / 1024;
					var decryptedContent = new StringContent($"Превышен допустимый размер файла ({mbSize:0.##} Mb)");
					var stream = await decryptedContent.ReadAsStreamAsync();
					var bodyStream = httpContext.Response.Body;
					await stream.CopyToAsync(bodyStream);
					httpContext.Response.Body = bodyStream;
				}
				else
					throw;
			}
		}
	}
}
