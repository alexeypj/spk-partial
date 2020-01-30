using System;
using System.Linq.Expressions;
using sopka.Models.Abstract;
using sopka.Models.ContextModels;

namespace sopka.Models.Filters
{
	public class EquipmentListFilter : PaginationFilter, ISortFilter, IFilterExpression<Equipment>
	{
		public int? ObjectId { get; set; }

		public string SortColumn { get; set; }

		public Direction SortDirection { get; set; }

		public Expression<Func<Equipment, bool>> WhereExpression
		{
			get { return entry => !ObjectId.HasValue || entry.IdObject == ObjectId; }
		}
	}
}
