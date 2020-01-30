import { ITableFilter, SortDirection } from "../../../Shared/Datatable/types";
import { IDictionaryItem, IDictionaryStringItem } from "../../../Store/Modules/Inventory/types";
import moment from "moment";

export interface IEquipmentJournalState {
    Dictionaries: IEquipmentJournalDictionaries;
    Filter: IEquipmentJournalFilter;
    Items: IEquipmentJournalItem[];
    TotalItems: number;
    IsLoading: boolean;
}

export interface IEquipmentJournalDictionaries {
    Objects: IDictionaryItem[];
    EquipmentTypes: IDictionaryItem[];
    Platforms: IDictionaryItem[];
    Equipments: IDictionaryItem[];
}

export interface IEquipmentJournalItem {
    Id: number;
    Level: string;
    Date: Date;
    DateFormatted: string;
    EquipmentId: number;
    EquipmentName: string;
    Source: string;
    Description: string;
}

export interface IEquipmentJournalFilter extends ITableFilter {
    UsePeriod: boolean;
    DateFrom?: Date | string;
    DateTo?: Date | string;
    ObjectId?: number;
    EquipmentTypeId?: number;
    PlatformId?: number;
    EquipmentId?: number;
}

export function createFilter(): IEquipmentJournalFilter {
    return {
        UsePeriod: false,
        DateFrom: moment().add(-1, "h").format("YYYY-MM-DD HH:mm:ss"),
        DateTo: moment().format("YYYY-MM-DD HH:mm:ss"),
        Page: 1,
        ItemsPerPage: 10,
        SortDirection: SortDirection.Asc,
        SortColumn: "Date"
    }
}