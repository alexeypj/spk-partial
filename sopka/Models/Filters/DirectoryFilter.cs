namespace sopka.Models.Filters
{
    public class DirectoryFilter : PaginationFilter, ISortFilter
    {
        public string Query { get; set; }
        public string SortColumn { get; set; }
        public Direction SortDirection { get; set; }
    }

    public class ObjectTypesFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public string Description { get; set; }
    }

    public class BranchesFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public string Description { get; set; }
    }

    public class EquipmentTypesFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public string Description { get; set; }
    }

    public class AttackTypesFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public string Description { get; set; }
    }

    public class RaidFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public string Description { get; set; }
    }

    public class OSFilter : DirectoryFilter
    {
        public string Product { get; set; }

        public string Manufacturer { get; set; }
    }

    public class SoftwareFilter : DirectoryFilter
    {
        public string Product { get; set; }

        public string Manufacturer { get; set; }
    }

    public class PlatformFilter : DirectoryFilter
    {
        public string Product { get; set; }

        public string Manufacturer { get; set; }
    }

    public class ProcessorFilter : DirectoryFilter
    {
        public string Product { get; set; }

        public string Manufacturer { get; set; }

        public int? CoresNumber { get; set; }
    }

    public class HDDFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public double? Volume { get; set; }
    }

    public class RAMFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public double? Volume { get; set; }
    }

    public class NetworkAdapterFilter : DirectoryFilter
    {
        public string Title { get; set; }

        public double? Speed { get; set; }
    }


    public class EquipmentLogSeverityFilter: DirectoryFilter
    {
        public int? SeverityId { get; set; }

        public string Synonym { get; set; }

    }

}