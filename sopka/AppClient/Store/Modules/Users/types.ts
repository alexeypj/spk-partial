import { IUser, IUserRole } from "../Common/types";

export interface IUsers {
    Users: IUser[];
    Roles: IUserRole[];
    Filter: IUserFilter;
    UsersTotal: number;
    IsLoading: boolean;
    SelectedUserId: string | null;
}

export interface IUserFilter {
    FIO?: string;
    RoleId?: string;
    Phone?: string;
    Email?: string;
    Status?: number;
    Page: number;
    ItemsPerPage: number;
    SortColumn?: string;
    SortDirection?: string;
}

export interface IUserInList extends IUser {
    _Id?: number;
    RoleText?: string;
    IsBlockText?: string;
}
