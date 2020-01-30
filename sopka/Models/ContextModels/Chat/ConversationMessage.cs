using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace sopka.Models.ContextModels.Chat
{
    public class ConversationMessage
    {
        public int Id { get; set; }

        /// <summary>Id чата - obj.ParentId</summary>
        public int ConversationId { get; set; }

        /// <summary>Название файла - obj.Str0</summary>
        public string FileName { get; set; }

        /// <summary>Есть приложенные файлы - obj.Bit0</summary>
        public bool HasAttachments { get; set; }

        /// <summary>Служебное сообщение - obj.Bit1</summary>
        public bool IsEmergency { get; set; }

        /// <summary>Не учитывать в счетчиках новых сообщений - obj.Bit2</summary>
        public bool IsSilent { get; set; }

        /// <summary>Id участника чата (ConversationUser) - obj.BigInt0</summary>
        public int OriginatorId { get; set; }


        public DateTimeOffset SendDate { get; set; } // Дата отправки - obj.Date0 

        /// <summary>Текст сообщения - obj.Description</summary>
        public string Text { get; set; }

        public string Recipients { get; set; }

        private string[] _toUsers;

        /// <summary>Пользователи, которым доступно данное сообщение - attr.ToUsers</summary>
        [NotMapped]
        public string[] ToUsers
        {
            get
            {
                if (_toUsers == null)
                {
                    if (string.IsNullOrEmpty(Recipients))
                    {
                        _toUsers = new string[0];
                    }
                    else
                    {
                        _toUsers = JsonConvert.DeserializeObject<string[]>(Recipients);
                    }
                }
                return _toUsers;
            }
            set => Recipients = JsonConvert.SerializeObject(value);
        }
    }
}