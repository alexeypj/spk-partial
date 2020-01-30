using System;

namespace sopka.Models.ContextModels
{
    public class UserConnection
    {
        public string ConnectionId { get; set; }
        public string UserId { get; set; }
        public DateTimeOffset LastAccess { get; set; }
        public string Ip { get; set; }
        public bool IsConnected { get; set; }

        public AppUser User { get; set; }

    }
}