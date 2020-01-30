namespace sopka.Services.Chat
{
    public class ReadMessagesModel
    {
        public int ConversationId { get; set; }
        public int[] MessageIds { get; set; }
        //public long ConversationId { get; set; }
        public int ConversationUserId { get; set; }

    }
}