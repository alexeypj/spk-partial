using System.Collections.Generic;

namespace sopka.Models.ViewModels
{
    public class IncidentDictionariesViewModel
    {
        public List<DictionaryItem<string>> Attacks { get; set; }

        public List<DictionaryItem<string, string>> Users { get; set; }

        public List<DictionaryItem<string, string>> Roles { get; set; }

        public List<DictionaryItem<string>> Equipments { get; set; }

        public List<DictionaryDataItem<string, string>> Objects { get; set; }

        public List<DictionaryItem<string>> Platforms { get; set; }

		public List<DictionaryItem<string, string>> Countries { get; set; }

        public List<DictionaryItem<string>> Severity { get; set; }
    }
}