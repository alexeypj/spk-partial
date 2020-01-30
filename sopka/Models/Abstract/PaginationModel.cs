using System.Collections.Generic;

namespace sopka.Models.Abstract
{
	public class PaginationModel<T>
	{
		public IEnumerable<T> Items { get; set; }
		public long Total { get; set; }
	}
}
