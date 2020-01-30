namespace sopka.Models.Filters
{
    public class IncidentHistoryFilter : PaginationFilter, ISortFilter
    {
        public int Id { get;set;}
        public string SortColumn { get; set; }
        public Direction SortDirection { get; set;}
    }
}
