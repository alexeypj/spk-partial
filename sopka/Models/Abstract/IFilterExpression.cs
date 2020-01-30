using System;
using System.Linq.Expressions;

namespace sopka.Models.Abstract
{
	public interface IFilterExpression<T>
	{
		Expression<Func<T, bool>> WhereExpression { get; }
	}
}
