using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sopka.Models.Filters
{
	public class UsersFilter : PaginationFilter, ISortFilter
	{
		public string FIO { get; set; }
		public string RoleId { get; set; }
		public string Phone { get; set; }
		public string Email { get; set; }
		public int? Status { get; set; }
        public string SortColumn { get; set; }
        public Direction SortDirection { get; set; }
    }
}
