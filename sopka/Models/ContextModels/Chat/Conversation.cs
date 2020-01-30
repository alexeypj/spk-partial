using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Chat
{
    public class Conversation
    {
        public int Id { get; set; }

        /// <summary>Тип чата - obj.Int1</summary>
        public int ChatType { get; set; }

        /// <summary>Собственное наименование - obj.Str5</summary>
        public string CustomName { get; set; }

        /// <summary>Тип сущности - obj.Int0</summary>
        public int? EntityEventTypeId { get; set; }

        /* public DateTimeOffset? InsDate { get; set; } // Дата создания - obj.InsDate */
        /// <summary>Активный чат - obj.Bit1</summary>
        public bool IsActive { get; set; }

        /// <summary>Групповой чат - obj.Bit0</summary>
        public bool IsGroup { get; set; }

        /* public int? OrgId { get; set; } // Для какого подразделения создан - obj.OrgId */
        /// <summary>Системный идентификатор чата - obj.Str6</summary>
        public string SysTopic { get; set; }

        /// <summary>Основание для чата (сущность Event) - obj.ParentId</summary>
        public long? TopicEventId { get; set; }

        /// <summary>Основание для чата (сущность Reference) - obj.ReferenceId</summary>
        public long? TopicRefId { get; set; }

        public DateTimeOffset Date { get; set; }
    }
}