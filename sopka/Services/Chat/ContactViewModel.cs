using System.Collections.Generic;
using System.Linq;

namespace sopka.Services.Chat
{
    /// <summary>
    /// Модель представления контакта
    /// </summary>
    public class ContactViewModel
    {
        /// <summary>
        /// Идентификационный номер пользователя
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Имя пользователя
        /// </summary>
        public string UserName { get; set; }

        public string Name { get; set; }

        /// <summary>
        /// true - online, false - offline
        /// </summary>
        public bool IsOnline { get; set; }

        /// <summary>
        /// Параметры текущего чата
        /// </summary>
        public ConversationViewModel Conversation { get; set; }

        /// <summary>
        /// Создание объекта
        /// </summary>
        public ContactViewModel()
        {
        }
    }
}