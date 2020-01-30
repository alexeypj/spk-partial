using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using sopka.Services.Chat;

namespace sopka.Models.ContextModels.Chat
{
    public class ConversationMessageStatus
    {
        public int Id { get; set; }

        /// <summary>Id чата - obj.ParentId</summary>
        public int ConversationId { get; set; }

        /// <summary>Id участника чата (ConversationUser) - obj.BigInt0</summary>
        public int ConversationUserId { get; set; }

        /// <summary>Id сообщения чата - obj.BigInt1</summary>
        public int MessageId { get; set; }

        public DateTimeOffset SendDate { get; set; } // Дата выставления статуса 

        /// <summary>Статус просмотра (доставлен, просмотрен)</summary>
        public int? Status { get; set; }

        public string UserId { get; set; }

        /// <summary>
        /// Метод выполняет присвоение статуса
        /// </summary>
        /// <param name="status"></param>
        public void SetStatus(MessageStatus status)
        {
            Status = (int)status;
        }

        /// <summary>
        /// Метод возвращает текущий статус
        /// </summary>
        /// <returns></returns>
        public MessageStatus? GetStatus()
        {
            if (!Status.HasValue)
            {
                return null;
            }
            return (MessageStatus)Status;
        }

    }
}