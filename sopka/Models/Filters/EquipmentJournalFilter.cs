using System;

namespace sopka.Models.Filters
{
    public class EquipmentJournalFilter : PaginationFilter, ISortFilter
    {
        public DateTime? DateFrom { get; set; }

        public DateTime? DateTo { get; set; }

        public int? ObjectId { get; set; }

        public int? EquipmentTypeId { get; set; }

        public int? PlatformId { get; set; }

        public int? EquipmentId { get; set; }
        public string SortColumn { get; set; }
        public Direction SortDirection { get; set; }
    }
}