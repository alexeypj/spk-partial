import { ITableFilter } from "../../../Shared/Datatable/types";

export interface ICompaniesState {
    Total: number,
    CompaniesList: ICompanyListItem[],
    Filter: ICompanyFilter,
    IsLoading: boolean,
}

export interface ICompanyListItem {
    Id: number,
    Name: string,
    CreateDate: Date,
    PaidTo?: Date | string,
    ObjectsCount: number,
    UsersCount: number,
    EquipmentsCount: number,
    CreateDateFormatted: string,
    PaidToFormatted: string,
    ResponsiblePersonEmail: string | null,
    Support: boolean,
    Comment: string,
    Paid: boolean,
    PaidText: string,
    TariffId: number,
    TariffName: string,
    Balance: number,
}

export interface ICompanyEditModel {
    Id: number,
    Name: string,
    PaidTo?: Date | string,
    PaidToFormatted?: string ,
    ObjectsCount: number,
    UsersCount: number,
    EquipmentsCount: number,
    Support: boolean,
    Comment: string,
    ResponsiblePersonEmail: string | null,
}

export function createFilter(): ICompanyFilter {
    return {
        ItemsPerPage: 10,
        Page: 1,
        SortDirection: "DESC",
        SortColumn: "Id"
    }
}

export interface ICompanyFilter extends ITableFilter {
    Name?: string;
    Support?: number;
    PaidTo?: Date | string;
    ResponsiblePersonEmail?: string;
    Comment?: string;
}
