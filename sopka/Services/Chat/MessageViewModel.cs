using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using sopka.Models.ContextModels.Chat;

namespace sopka.Services.Chat
{
    public class MessageViewModel
    {
        public ConversationMessage Body { get; set; }
        public bool IsOwn { get; set; }
        public ConversationUser User { get; set; }
        public MessageStatus? Status { get; set; }
        public DateTimeOffset SendDate { get; set; }
        public List<AttachmentViewModel> Attachments { get; set; }
        public List<string> ToUsers { get; set; }

        public MessageViewModel()
        {
            Attachments = new List<AttachmentViewModel>();
        }
    }

    public class AttachmentViewModel
    {
        public int MessageId { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public enum MessageStatus
    {
        /// <summary>
        /// доставлено
        /// </summary>
        [Display(Name = "Доставлено")]
        Delivered,

        /// <summary>
        /// Просмотрен
        /// </summary>
        [Display(Name = "Просмотрено")]
        Seen
    }

}