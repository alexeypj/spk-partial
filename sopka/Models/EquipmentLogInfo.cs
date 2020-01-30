using System;
using System.Security.AccessControl;

namespace sopka.Models
{
    public class EquipmentLogInfo
    {
        public Guid TempId { get; set; }

        public string Level { get; set; }

        public string Description { get; set; }

        public DateTime Date { get; set; }

        public string Source { get; set; }

        public int? EquipmentId { get; set; }

        public int? SeverityId { get; set; }

        public string EquipmentIp { get; set; }

        public string EquipmentName { get; set; }
    }
}