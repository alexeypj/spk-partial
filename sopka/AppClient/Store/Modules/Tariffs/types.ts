import { ITableFilter } from "../../../Shared/Datatable/types";

export interface ITariffsState {
    Tariffs: ITariff[],
    Total: number,
    Filter: ITariffFilter,
    IsLoading: boolean,
    SelectedTariffId: number|null
}

export interface ITariffFilter extends  ITableFilter {
    Query?: string
}

export interface ITariff {
    Id: number,
    Name: string,
    UsersCount: number,
    ObjectsCount: number,
    EquipmentsCount: number,
    Period: number,
    Support: boolean,
    IsCloud: boolean,
    IsActive: boolean
}

export interface ITariffInList extends ITariff {
    SupportText?: string,
    IsActiveText?: string
} 
