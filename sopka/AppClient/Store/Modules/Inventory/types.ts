import { ITableFilter } from "../../../Shared/Datatable/types";

export interface IObjectEntry {
    Id: number;
    ObjectName: string;
    ObjectAddress: string;
    ContactPerson: string;
    ContactPosition: string;
    ContactPhone: string;
    IdBranch?: number;
    IdObject?: number;
    IdType?: number;
    ContactMail: string;
    Latitude: number | null;
    Longitude: number | null;
}

export interface IAddress {
    Address: string | null;
    Latitude: number | null;
    Longitude: number | null;
}

export interface IEquipmentListItem {
    Id: number;
    IdObject: number;
    TypeName: string;
    NetworkName: string;
    Model: string;
    Platform: string;
    IP: string;
    Vlan: string;
    Name: string;
    ObjectAddress: string;
}

export interface IEquipment {
    Id: number;
    IdObject?: number;
    Type: number;
    Name: string;
    Model: string;
    Platform: number;
    Devices: IDevice[];
    RecordsMinCount?: number;
    RecordsMaxCount?: number;
    RecordsCheckPeriod?: number;
}

export interface IHDD {
    Id: number;
    IdDevice: number;
    IdHDDDirectory: number;
    Count: number;
    IdRAIDDirectory: number;
}

export interface IMemory {
    Id: number;
    IdDevice: number;
    IdRAMDirectory: number;
    Value: number;
    Count: number;
}

export interface IOperationSystem {
    Id: number;
    IdDevice: number;
    IdOSDirectory: number;
    Version: string;
}

export interface ISoftware {
    Id: number;
    IdDevice: number;
    IdSoftDirectory: number;
    Version: string;
}

export interface INetworkAdapter {
    Id: string;
    IdDevice: string;
    IdNetworkAdapterDirectory: number;
}

export interface IDictionaryItem {
    Key: number | string;
    Value: string;
    Data?: string;
}

export interface IDictionaryStringItem {
    Key: string;
    Value: string;
    Data?: string;
}

export interface IDevice {
    Id: number;
    IdEquipment: number;
    NetworkName?: string;
    SyslogAddress?: string;
    EventRegist?: string;
    AWZ?: string;
    AWZDate?: string;
    AWZDatePeriod?: string;
    IAF?: string;
    Mask?: string;
    Gateway?: string;
    Vlan?: string;
    Additional?: string;

    IdCPU?: number;
    CPUCount?: number;

    Memory: IMemory[];
    Software: ISoftware[];
    OperationSystems: IOperationSystem[];
    HDD: IHDD[];
    NetworkAdapters: INetworkAdapter[];
}

export interface IInventoryState {
    Object: IObjectEntry | null;
    Objects: IObjectEntry[];
    Dictionaries: {
        Branches: IDictionaryItem[],
        Types: IDictionaryItem[]
    };
    IsListLoading: boolean;
    IsContentLoading: boolean;
    SelectedId: number| null;
    IsObjectSaving: boolean;
    EquipmentList: IEquipmentListItem[];
    EquipmentFilter: IEquipmentListFilter;
    EquipmentTotalItems: number;
    Equipment: IEquipment | null;
    Devices: {
        Dictionaries: {
            DeviceTypes: IDictionaryItem[];
            Platforms: IDictionaryItem[];
            Objects: IDictionaryItem[];
            RaidTypes: IDictionaryItem[];
            CPU: IDictionaryItem[];
            Memory: IDictionaryItem[];
            OS: IDictionaryItem[];
            Software: IDictionaryItem[];
            HDD: IDictionaryItem[];
            NetworkAdapters: IDictionaryItem[];
        }
    };
}

export interface IInventoryFilter {
    SearchString?: string;
    Page?: number;
}

export interface IEquipmentListFilter extends ITableFilter {
    ObjectId: number;
}

export interface IObjectSummary {
    Id: number;
    ObjectName: string;
    ObjectAddress: string;
    Latitude: number;
    Longitude: number;
    IncidentCount: number;
}

export interface ICounter {
    Type: string;
    Value: number;
}

export interface ISummary {
    Objects: IObjectSummary[];
    Counters: ICounter[];
}

export function hasChanges(source: IObjectEntry, target: IObjectEntry): boolean {
    return source.Id !== target.Id ||
    source.ContactMail !== target.ContactMail ||
    source.ContactPerson !== target.ContactPerson ||
    source.ContactPhone !== target.ContactPhone ||
    source.ContactPosition !== target.ContactPosition ||
    source.IdBranch !== target.IdBranch ||
    source.IdType !== target.IdType ||
    source.Latitude !== target.Latitude ||
    source.Longitude !== target.Longitude ||
    source.ObjectAddress !== target.ObjectAddress ||
    source.ObjectName !== target.ObjectName;
}

export enum RecordsCheckPeriods {
    "раз в день" = 0,
    "раз в неделю" = 1,
    "раз в месяц" = 2
}
