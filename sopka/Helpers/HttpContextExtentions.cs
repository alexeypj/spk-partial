using System;
using Microsoft.AspNetCore.Http;

namespace sopka.Helpers
{
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

    }
}