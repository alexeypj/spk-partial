using System;
using sopka.Models.ContextModels;

namespace sopka.Models.EquipmentLogs
{
    public class EquipmentLog
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string Level { get; set; }

        public string Description { get; set; }

        public string Source { get; set; }

        public int? EquipmentId { get; set; }

        public int? SeverityId { get; set; }

        public Equipment Equipment { get; set; }
    }
}