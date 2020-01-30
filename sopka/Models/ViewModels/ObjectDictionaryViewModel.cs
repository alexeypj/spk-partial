using System.Collections.Generic;

namespace sopka.Models.ViewModels
{
	public class ObjectDictionaryViewModel
	{
		public IEnumerable<DictionaryItem<string>> Types { get; set; }
		public IEnumerable<DictionaryItem<string>> Branches { get; set; }
	}
}
