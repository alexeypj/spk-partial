using System;

namespace sopka.Models.Filters
{
    public class IncidentFilter : PaginationFilter, ISortFilter
    {
		public int? Id { get; set; }

        public string Title { get; set; }

        public int? AttackType { get; set; }

        public DateTimeOffset? FixationTime { get; set; }

        public int? Status { get; set; }

        public string ResponsibleRoleId { get; set; }

        public string CreatorId { get; set; }

        public int? ObjectId { get; set; }

        public int? EquipmentId { get; set; }

        public int? PlatformId { get; set; }

        public string Country { get; set; }
        
        public string SortColumn { get; set; }

		public string SourceIP { get; set; }

        public bool? ShowClosed { get; set; }

        public Direction SortDirection { get; set; }
	}
}