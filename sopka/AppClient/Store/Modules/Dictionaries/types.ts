import { ITableFilter } from "../../../Shared/Datatable/types";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";

export interface IDictionaries {
    IsSaving: boolean;
    CurrentTab: DictionariesTab;
    Dictionaries: IDictionaryType[];
    ObjectTypesState: IDirectoryState<IObjectTypeDirectory, IObjectTypesFilter>;
    BranchesState: IDirectoryState<IBranchDirectory, IBranchesFilter>;
    EquipmentTypesState: IDirectoryState<IEquipmentDirectory, IEquipmentTypesFilter>;
    AttackTypesState: IDirectoryState<IAttackTypeDirectory, IAttackTypesFilter>;
    RaidState: IDirectoryState<IRaidDirectory, IRaidFilter>;
    OSState: IDirectoryState<IOSDirectory, IOSFilter>;
    SoftwareState: IDirectoryState<ISoftwareDirectory, ISoftwareFilter>;
    PlatformState: IDirectoryState<IPlatformDirectory, IPlatformFilter>;
    CPUState: IDirectoryState<ICPUDirectory, ICPUFilter>;
    HDDState: IDirectoryState<IHDDDirectory, IHDDFilter>;
    RAMState: IDirectoryState<IRAMDirectory, IRAMFilter>;
    NetworkAdaptersState: IDirectoryState<INetworkAdapterDirectory, INetworkAdapterFilter>;
    IncidentCriticalityDictionary: IDictionaryItem[];
    EquipmentLogSeverity: IDictionaryItem[];
    SeveritySynonymsState: IDirectoryState<ISeveritySynonymsDirectory, ISeveritySynonymsFilter>;
}

export interface IDictionaryType {
    Title: string;
    Component: any;
    IsSelected: boolean;
    LogAction: string;
}

export interface IEquipmentDirectory {
    Id: number;
    Title: string;
    Description: string;
}

export interface IPlatformDirectory {
    Id: number;
    Manufacturer: string;
    Product: string;
}

export interface ICPUDirectory {
    Id: number;
    Manufacturer: string;
    Product: string;
    CoresNumber?: number;
}

export interface IRAMDirectory {
    Id: number;
    Title: string;
    Volume: number;
}

export interface IHDDDirectory {
    Id: number;
    Title: string;
    Volume: number;
}

export interface INetworkAdapterDirectory {
    Id: number;
    Title: string;
    Speed: number;
}

export interface ISoftwareDirectory {
    Id: number;
    Manufacturer: string;
    Product: string;
}

export interface IOSDirectory {
    Id: number;
    Manufacturer: string;
    Product: string;
}

export interface IObjectTypeDirectory {
    Id: number;
    Title: string;
    Description: string;
}

export interface IBranchDirectory {
    Id: number;
    Title: string;
    Description: string;
}

export interface IAttackTypeDirectory {
    Id: number;
    Title: string;
    Description: string;
    CriticalityDefault: number;
    CriticalityName?: string;
}

export interface IRaidDirectory {
    Id: number;
    Title: string;
    Description: string;
}

export interface ISeveritySynonymsDirectory {
    SeverityId: number;
    SeverityTitle: string;
    Synonym: string;
}

export interface ISeveritySynonymsEditModel {
    OldSeverityId?: number,
    NewSeverityId: number,
    OldSynonym?: string,
    NewSynonym?: string,
}

export enum DictionariesTab {
    ObjectTypes,
    Branches
}

export interface IDictionaryFilter extends ITableFilter {
    Query?: string;
}

export interface IObjectTypesFilter extends IDictionaryFilter {
    Id?: number;
    Title?: string;
    Description?: string;
}

export interface IBranchesFilter extends IDictionaryFilter {
    Id?: number;
    Title?: string;
    Description?: string;
}

export interface IEquipmentTypesFilter extends IDictionaryFilter {
    Id?: number;
    Title?: string;
    Description?: string;
}

export interface IAttackTypesFilter extends IDictionaryFilter {
    Id?: number;
    Title?: string;
    Description?: string;
}

export interface IRaidFilter extends IDictionaryFilter {
    Title?: string;
    Description?: string;
}

export interface IOSFilter extends IDictionaryFilter {
    Id?: number;
    Manufacturer?: string;
    Product?: string;
}

export interface ISoftwareFilter extends IDictionaryFilter {
    Id?: number;
    Manufacturer?: string;
    Product?: string;
}

export interface IPlatformFilter extends IDictionaryFilter {
    Id?: number;
    Manufacturer?: string;
    Product?: string;
}

export interface ICPUFilter extends IDictionaryFilter {
    Id?: number;
    Manufacturer?: string;
    Product?: string;
}

export interface IHDDFilter extends IDictionaryFilter {
    Id?: number;
    Title?: string;
    Volume?: number;
}

export interface IRAMFilter extends IDictionaryFilter {
    Id?: number;
    Title?: string;
    Volume?: number;
}

export interface INetworkAdapterFilter extends IDictionaryFilter {
    Id?: number;
    Title?: string;
    Speed?: number;
}

export interface ISeveritySynonymsFilter extends IDictionaryFilter {
    SeverityId?: number;
    Synonym?: string;
}

export interface IDirectoryState<T, TFilter> {
    Filter: TFilter;
    Items: T[];
    TotalItems: number;
}

export interface IIncidentCriticality {
    Id: number;
    Criticality: string;
}
