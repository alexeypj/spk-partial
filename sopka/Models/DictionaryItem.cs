namespace sopka.Models
{
	public class DictionaryItem<T>: DictionaryItem<int, T>
    {
		public DictionaryItem() { }

        public DictionaryItem(int key, T value) : base(key, value) { }
    }

	public class DictionaryItem<TKey, TValue>
	{
		public TKey Key { get; set; }
		public TValue Value { get; set; }

		public DictionaryItem() { }

		public DictionaryItem(TKey key, TValue value)
		{
			Key = key;
			Value = value;
		}
	}

}
