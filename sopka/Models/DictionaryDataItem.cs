namespace sopka.Models
{
	public class DictionaryDataItem<T,T1>
	{
		public int Key { get; set; }
		public T Value { get; set; }
		public T1 Data { get; set; }

		public DictionaryDataItem() { }

		public DictionaryDataItem(int key, T value, T1 data)
		{
			Key = key;
			Value = value;
			Data = data;
		}
	}
}
