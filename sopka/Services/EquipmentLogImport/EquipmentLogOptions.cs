using System.Collections.Generic;

namespace sopka.Services.EquipmentLogImport
{
    public class EquipmentLogOptions
    {
        public Dictionary<string, string> FieldMapping { get; set; }
        public int BatchSize { get; set; }
    }
}