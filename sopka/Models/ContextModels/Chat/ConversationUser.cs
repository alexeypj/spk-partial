using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Chat
{
    public class ConversationUser
    {
        public int Id { get; set; }

        /// <summary>Id чата - obj.ParentId</summary>
        public int ConversationId { get; set; }

        /// <summary>Активен - obj.Bit2</summary>
        public bool IsActive { get; set; }

        /// <summary>Спец права - obj.Bit1</summary>
        public bool IsAdmin { get; set; }

        /// <summary>Начал чат - obj.Bit0</summary>
        public bool IsStarter { get; set; }

        /// <summary>Дата последнего просмотра чата - obj.SendDate</summary>
        public DateTimeOffset LastConversationViewDate { get; set; }

        /// <summary>Имя пользователя - obj.Str0</summary>
        public string Name { get; set; }

        public string UserId { get; set; }

        [NotMapped]
        public bool IsOnline { get; set; }

        [NotMapped]
        public string UserName { get; set; }

        public AppUser User { get; set; }
    }
}