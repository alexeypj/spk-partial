namespace sopka.Models.Filters
{
	public enum Direction
	{
		Asc,
		Desc
	}

	public interface ISortFilter
	{
		string SortColumn { get; set; }
		Direction SortDirection { get; set; }
	}
}
