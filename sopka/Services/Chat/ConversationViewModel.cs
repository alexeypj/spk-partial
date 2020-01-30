using System;
using System.Collections.Generic;
using sopka.Models.ContextModels.Chat;

namespace sopka.Services.Chat
{
    /// <summary>
    /// Класс описывает участников и дополнительные параметры чата
    /// </summary>
    public class ConversationViewModel
    {
        /// <summary>
        /// Чат
        /// </summary>
        public Conversation Entity { get; set; }

        /// <summary>
        /// Участники чата
        /// </summary>
        public List<ConversationUser> Users { get; set; } = new List<ConversationUser>();

        /// <summary>
        /// Инициатор чата
        /// </summary>
        public long LocalOriginatorId { get; set; }

        /// <summary>
        /// Количество непрочитанных сообщений
        /// </summary>
        public int UnreadCount { get; set; }

        /// <summary>
        /// Служебное сообщение
        /// </summary>
        public string EmergencyMessage { get; set; }

        /// <summary>
        /// Дата последней активности
        /// </summary>
        public DateTimeOffset? LastActionDate { get; set; }
        /// <summary>
        /// Доступно ли добавление сообщений в чат в текущий момент для пользователя
        /// </summary>
        public bool ReadOnly { get; set; }
    }
}