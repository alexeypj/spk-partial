using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sopka.Models.Filters
{
    public class EquipmentLogsFilter : PaginationFilter, ISortFilter
    {
        public string Name { get; set; }

        public string SortColumn { get; set; }

        public Direction SortDirection { get; set; }
    }
}
