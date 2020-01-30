using System;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using sopka.Models.Abstract;
using sopka.Models.Enum;

namespace sopka.Models.ContextModels
{
    public class LogAction: IOwnedByCompany
    {
        public long Id { get; set; }

        public string ActionName { get; set; }

        public bool IsMainAction { get; set; }

        public string UserId { get; set; }

        public string UserName { get; set; }

        public int? SessionId { get; set; }

        public string Url { get; set; }

        public string Ip { get; set; }

        public string Parameters { get; set; }

        public ActionEntityType? EntityType { get; set; }

        public string EntityId { get; set; }

        public string EntityTitle { get; set; }

        public DateTimeOffset Date { get; set; }

        public int? CompanyId { get; set; }

        public string Headers { get; set; }
    }
}