using Newtonsoft.Json;

namespace sopka.Models.Messenger
{
    public class UserOnlineStatus
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public bool IsOnline { get; set; }

        public string ToJson() => JsonConvert.SerializeObject(this);

        public static UserOnlineStatus CreateInstance(string userId, string userName, bool isOnline) => new UserOnlineStatus { IsOnline = isOnline, UserId = userId, UserName = userName };
    }
}
