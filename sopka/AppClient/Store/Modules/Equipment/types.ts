import { ITableFilter } from "../../../Shared/Datatable/types";
import { IDictionaryItem, IEquipment } from "../Inventory/types";

export interface IEquipmentState {
    Equipments: IEquipment[];
    Filter: IEquipmentFilter;
    IsContentLoading: boolean;
    EquipmentTotalItems: number;
    Dictionaries: IEquipmentDictionaries;
    SelectedId: number|null;
}

export interface IEquipmentDictionaries {
    Objects: IDictionaryItem[];
    CPU: IDictionaryItem[];
    Memory: IDictionaryItem[];
    HDD: IDictionaryItem[];
    NetworkAdapters: IDictionaryItem[];
    OS: IDictionaryItem[];
    Software: IDictionaryItem[];
    Platforms: IDictionaryItem[];
    DeviceTypes: IDictionaryItem[];
    RaidTypes: IDictionaryItem[];
}

export interface IEquipmentFilter extends ITableFilter {
    Id?: number;
    Name?: string;
    ObjectId: string ;
    CPUId: string ;
    MemoryId: string ;
    HDDId: string ;
    NetworkAdapterId: string ;
    OperationSystemId: string;
    SoftwareId: string;
    TypeId?: number;
    PlatformId?: number;
    Query?: string;
    NetworkName?: string;
    IP?: string;
    Vlan?: string;
}

export function volumeDict(dictinaries: IDictionaryItem[]): IDictionaryItem[] {
    return dictinaries.map(x => <IDictionaryItem> { Key: x.Key, Value: `${x.Value} ${x.Data}Gb`});
}

export function networkAdaptersDict(dictinaries: IDictionaryItem[]): IDictionaryItem[] {
    return dictinaries.map(x => <IDictionaryItem> { Key: x.Key, Value: `${x.Value} ${x.Data} Mbps` });
}
