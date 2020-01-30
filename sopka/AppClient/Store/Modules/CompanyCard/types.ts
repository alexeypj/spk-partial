import { ITableFilter } from "../../../Shared/Datatable/types";

export interface ICompanyCardState {
    CompanyCard: ICompanyCard | null,
    IsLoading: boolean,
    Tariffs: ITariff[],
}

export interface ICompany {
    Id: number,
    Name: string,
    CreateDate: Date,
    CreateDateFormatted: string,
    PaidTo: Date | null,
    PaidToFormatted: string | null,
    Paid: boolean,
    PaidText: string,
    TariffId: number,
    TariffName: string,
    Balance: ICompanyBalance,
    ResponsiblePersonFIO: string | null,
    ResponsiblePersonEmail: string | null,
    ResponsiblePersonPhone: string | null,
    Comment: string,
}

export interface ICompanyCard {
    CompanyInfo: ICompany,
    CurrentEquipmentsCount: number,
    CurrentObjectsCount: number,
    CurrentUsersCount: number,
    MaxEquipmentsCount: number,
    MaxObjectsCount: number,
    MaxUsersCount: number,
}

export interface ICompanyBalance {
    Id: number,
    Value: number,
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
