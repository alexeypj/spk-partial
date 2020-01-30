namespace sopka.Models.Filters
{
    public class EquipmentFilter: PaginationFilter, ISortFilter
    {
		public int? Id { get; set; }

        public string Query { get; set; }

        public int? ObjectId { get; set; }

        public int? CPUId { get; set; }

        public int? MemoryId { get; set; }

        public int? HDDId { get; set; }

        public int? NetworkAdapterId { get; set; }

        public int? OperationSystemId { get; set; }

        public int? SoftwareId { get; set; }

        public string IP { get; set; }
        
		public string Vlan { get; set; }

		public int? TypeId { get; set; }

		public int? PlatformId { get; set; }

		public string NetworkName { get; set; }

		public string Name { get; set; }

        public string SortColumn { get; set; }
        public Direction SortDirection { get; set; }
    }
}