using System;

namespace sopka.Models.Filters
{
    public class CompaniesFilter : PaginationFilter, ISortFilter
    {
        public string Query { get; set; }

        public string SortColumn { get; set; }

        public Direction SortDirection { get; set; }

        public DateTimeOffset? PaidTo { get; set; }

        public string Name { get; set; }

        public int? Support { get; set; }

        public string ResponsiblePersonEmail { get; set; }

        public string Comment { get; set; }
    }
}