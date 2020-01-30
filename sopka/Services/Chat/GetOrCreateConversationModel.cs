using System.Collections.Generic;

namespace sopka.Services.Chat
{
    public class GetOrCreateConversationModel
    {
        public List<string> UserIds { get; set; }
        public List<string> UserNames { get; set; }
        public long? EntityId { get; set; }
        public int? EventTypeId { get; set; }
        public int[] OrgIds { get; set; }
        public ChatTypeEnum ChatType { get; set; }
        public GetOrCreateConversationModel()
        {
            UserIds = new List<string>();
            UserNames = new List<string>();
        }

    }
}