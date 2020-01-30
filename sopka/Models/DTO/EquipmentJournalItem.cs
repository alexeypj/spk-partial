using System;

namespace sopka.Models.DTO
{
    public class EquipmentJournalItem
    {
        public long Id { get; set; }

        public string Level { get; set; }

        public DateTime Date { get; set; }

        public string Source { get; set; }

        public string Description { get; set; }

        public int? EquipmentId { get; set; }

        public string EquipmentName { get; set; }
    }
}