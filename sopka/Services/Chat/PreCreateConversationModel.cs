using System.Collections.Generic;
using sopka.Models.ContextModels.Chat;

namespace sopka.Services.Chat
{
    /// <summary>
    /// Модель предварительного создания чата
    /// </summary>
    public class PreCreateConversationModel
    {
        public int? ConversationId { get; set; }
        public bool IsGroup { get; set; }
        public List<ConversationUser> Users { get; set; }
        public int? OrgId { get; set; }
        public long? ReferenceId { get; set; }
        public long? EventsId { get; set; }
        public int? EventTypeId { get; set; }
        public string Topic { get; set; }
        public ChatTypeEnum ChatType { get; set; }
    }
}