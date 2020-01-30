export interface ICommon {
    CurrentUser: IUser;
    Settings: ISopkaSettings;
    IsFileListLoading: boolean;
}

export interface IUser {
    Id: string;
    IsAuthenticated: boolean;
    UserName: string;
    FIO: string;
    Email: string;
    PhoneNumber: string;
    IsBlock: boolean;
    BlockReason: string;
    BlockDate?: Date;
    UserRoles: IAppRole[];
    CompanyId?: number;
    IsAccessPaid?: boolean;
}

export class User implements IUser {
    public Id: string = "";
    public IsAuthenticated: boolean = false;
    public UserName: string;
    public FIO: string;
    public Email: string;
    public PhoneNumber: string;
    public IsBlock: boolean;
    public BlockReason: string;
    public UserRoles: IAppRole[];

    public static getDefault(): IUser {
        return new User();
    }

}

export interface IUserRole {
    Id: string;
    Name: string;
}

export interface IAppRole {
    RoleId: string;
    UserId: string;
    Name?: string;
    ShortTitle: string;
}

export enum Roles {
    DutyShift = "Дежурная смена (первая линия, Центр мониторинга, ПАО «МОЭСК»)'",
    CorporateCenterSecondLine = "Корпоративный центр (вторая линия)",
    CorporateCenterFirstLine = "Корпоративный центр (третья линия)",
    Admin = "Администратор системы",
    CompanyAdmin = "Администратор компании"
}

export interface IJSTreeItem {
    id: string;
    parent: string;
    text: string;
    type: string;
}

export interface IFile {
    Id: number;
    PreviewId?: number;
    ContentType: string;
    Name: string;
    Size?: number;
}

export interface ISopkaSettings {
    Logo: {
        PortalType: string;
        PortalTitle: string;
        PortalLogo: string;
        LoginLogo: string;
    };
    MaxFileSize: number;
    IsLimited: boolean;
    IsDebug: boolean;
}

export interface IPaginationModel<T> {
    Items: T[];
    Total: number;
}
