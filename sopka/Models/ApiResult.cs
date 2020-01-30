using Newtonsoft.Json;

namespace sopka.Models
{
    public class ServiceActionResult
    {
        public bool Success { get; set; }

        public string Message { get; set; }



        public static ServiceActionResult GetFailed(string message)
        {
            return new ServiceActionResult { Success = false, Message = message };
        }

        public static ServiceActionResult GetFailed()
        {
            return new ServiceActionResult { Success = false };
        }

        public static ServiceActionResult GetSuccess()
        {
            return new ServiceActionResult { Success = true };
        }


        /// <summary>
        /// Сущность
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public object Entity { get; set; }

        /// <summary>
        /// Идентификатор сущности
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? EntityId { get; set; }


        /// <summary>
        /// Метод выполняет создание объекта успешного выполнения операции
        /// </summary>
        /// <param name="entityId">Идентификатор сущности</param>
        /// <param name="entity">Сущность</param>
        /// <returns>Результат выполнения операции</returns>
        public new static ServiceActionResult GetSuccess(int? entityId = null, object entity = null)
        {
            return new ServiceActionResult { Success = true, EntityId = entityId, Entity = entity };
        }

    }
}