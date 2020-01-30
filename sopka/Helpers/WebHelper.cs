using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using JobServer.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace sopka.Helpers
{
    /// <summary>
    /// Помощник для работы с Web
    /// </summary>
    public static class WebHelper
    {
        /// <summary>
        /// Получение идентификатора соединения
        /// </summary>
        /// <param name="ctrl">Контроллер</param>
        /// <returns></returns>
        public static string GetConnectionId(this Controller ctrl)
        {
            return ctrl.Request.GetConnectionId();
        }

        /// <summary>
        /// Получение идентификатора соединения
        /// </summary>
        /// <param name="request">Запрос</param>
        /// <returns></returns>
        public static string GetConnectionId(this HttpRequest request)
        {
            if (request.Headers.TryGetValue("connection-id", out var conIdVal) && conIdVal.Count > 0)
            {
                return conIdVal[0];
            }

            return null;
        }

        /// <summary>
        /// Преобразование потока в набор байт
        /// </summary>
        /// <param name="stream">Поток</param>
        /// <returns></returns>
        public static byte[] ToByteArray(Stream stream)
        {
            var buffer = new byte[32768];
            using (var ms = new MemoryStream())
            {
                while (true)
                {
                    int read = stream.Read(buffer, 0, buffer.Length);
                    if (read <= 0)
                        return ms.ToArray();
                    ms.Write(buffer, 0, read);
                }
            }
        }

        /// <summary>
        /// Получение тела запроса
        /// </summary>
        /// <param name="request">Запрос</param>
        /// <returns></returns>
        public static byte[] GetBodyData(this HttpRequest request)
        {
            return ToByteArray(request.Body);
        }
    }
}