using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sopka.Models.Filters
{
    public class KbFilter
    {
        public int? AttackTypeId { get; set; }
        public int? EquipmentTypeId { get; set; }
        public int? PlatformId { get; set; }
        public int? MemoryId { get; set; }
        public int? CpuId { get; set; }
        public int? Raid { get; set; }
        public int? HDD { get; set; }
        public int? NetworkAdapter { get; set; }
        public int? Software { get; set; }
        public int? OS { get; set; }
        public string Query { get; set; }
    }
}
