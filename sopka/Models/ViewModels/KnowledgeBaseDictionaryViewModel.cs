using System.Collections.Generic;

namespace sopka.Models.ViewModels
{
	public class KnowledgeBaseDictionaryViewModel : EquipmentDictionaryViewModel
	{
		public IEnumerable<DictionaryItem<string>> AttackTypes { get; set; }
	}
}
