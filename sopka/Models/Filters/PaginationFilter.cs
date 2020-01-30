using System;
using System.Runtime.Serialization;
using Dapper.Contrib.Extensions;
using Newtonsoft.Json;

namespace sopka.Models.Filters
{
	public class PaginationFilter
	{
		public int Page { get; set; } = 1;

		public int ItemsPerPage { get; set; } = 20;

		public int TotalPages { get; set; }
		
		[JsonIgnore]
		public int Skip
		{
			get
			{
				if (Page < 1) Page = 1;
				var offset = (Page - 1) * ItemsPerPage;
				if (offset < 0) offset = 0;
				return offset;
			}
		}
	}
}
