using System.Collections.Generic;
using sopka.Models.ContextModels;

namespace sopka.Models.ViewModels
{
    public class IncidentCreationDictionariesViewModel
    {
        public IEnumerable<EquipmentListItem> Equipments { get; set; }

        public List<DictionaryDataItem<string, int>> Attacks { get; set; }

        public List<IncidentListItem> Incidents { get; set; }

        public List<DictionaryItem<string>> Severity { get; set; }
    }
}