using System;
using System.Linq.Expressions;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;

namespace sopka.Models.Filters
{
	public class InventoryFilter : PaginationFilter, IFilterExpression<ObjectEntry>
	{
        public InventoryFilter()
        {
            ItemsPerPage = int.MaxValue;
            Page = 1;
        }

		public string SearchString { get; set; }

		public Expression<Func<ObjectEntry, bool>> WhereExpression
		{
			get
			{
				if (string.IsNullOrEmpty(SearchString) == false)
				{
					return entry =>
						entry.ObjectName.StartsWith(SearchString, StringComparison.InvariantCultureIgnoreCase)
						|| entry.ObjectAddress.StartsWith(SearchString, StringComparison.InvariantCultureIgnoreCase);
				}

				return entry => true;
			}
		}
	}
}
