namespace sopka.Services.Chat
{
    public class ConversationRequestModel
    {
        public int? ConversationId { get; set; }
        public string[] UserIds { get; set; }
        public int? OrgId { get; set; }
        public long? EventsId { get; set; }
        public int? ReferenceId { get; set; }
        public int? EventTypeId { get; set; }
        public string Topic { get; set; }
        public ChatTypeEnum ChatType { get; set; }
    }
}