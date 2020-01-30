using System.Collections.Generic;

namespace sopka.Models.ViewModels
{
	public class EquipmentDictionaryViewModel
	{
		public IEnumerable<DictionaryItem<string>> DeviceTypes { get; set; }

		public IEnumerable<DictionaryItem<string>> Platforms { get; set; }

		public IEnumerable<DictionaryItem<string>> RaidTypes { get; set; }

		public IEnumerable<DictionaryItem<string>> Objects { get; set; }

		public IEnumerable<DictionaryItem<string>> CPU { get; set; }

		public IEnumerable<DictionaryDataItem<string, float?>> Memory { get; set; }

		public IEnumerable<DictionaryItem<string>> OS { get; set; }

		public IEnumerable<DictionaryItem<string>> Software { get; set; }

		public IEnumerable<DictionaryDataItem<string, float?>> HDD { get; set; }

		public IEnumerable<DictionaryDataItem<string, float?>> NetworkAdapters { get; set; }
	}
}
