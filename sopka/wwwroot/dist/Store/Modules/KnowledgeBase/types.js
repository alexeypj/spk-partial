export class Article {
    constructor() {
        this.Id = null;
        this.IdFolder = 0;
        this.Title = "";
        this.Description = "";
        this.Solution = "";
        this.Files = [];
        this.AttackTypeTags = [];
        this.EquipmentTypeTags = [];
        this.PlatformTags = [];
        this.MemoryTags = [];
        this.CPUTags = [];
        this.RaidTags = [];
        this.HddTags = [];
        this.NetworkAdapterTags = [];
        this.SoftwareTags = [];
        this.OSTags = [];
    }
}
export function GetDefaultFilter() {
    return {
        AttackTypeId: undefined,
        EquipmentTypeId: undefined,
        PlatformId: undefined,
        MemoryId: undefined,
        CpuId: undefined,
        Raid: undefined,
        HDD: undefined,
        NetworkAdapter: undefined,
        Software: undefined,
        OS: undefined
    };
}
//# sourceMappingURL=types.js.map