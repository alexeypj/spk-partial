import { IDictionaryItem } from "../Inventory/types";
import moment from "moment";
import { ITableFilter, SortDirection } from "../../../Shared/Datatable/types";
import Desc = SortDirection.Desc;

export interface ILogActionState {
    Logs: ILogAction[],
    Total: number,
    IsLoading: boolean,
    Filter: ILogActionFilter,
    Dics: ILogActionDictionaries,
    SelectedLog: ILogAction | null
}

export interface ILogActionDictionaries {
    Actions: IDictionaryItem[],
    Users: IDictionaryItem[],
    ActionTypes: IDictionaryItem[],
    EntityTypes: IDictionaryItem[]
}

export interface ILogActionFilter extends ITableFilter {
    Id?: number;
    UsePeriod: boolean;
    DateFrom: Date | string,
    DateTo: Date | string,
    UserId: string | null,
    SessionId: number | null,
    ActionName: string | null,
    ActionType?: string | null,
    Date?: Date | string,
    EntityType?: string,
}

export interface ILogAction {
    Id: number,
    Date: Date,
    Action: string,
    ActionTitle: string,
    ActionType; string,
    IsMainAction: boolean,
    Entity: string | null,
    EntityTitle: string | null,
    EntityId: string | null,
    EntityUrl: string | null,
    UserId: string,
    UserInfo: string,
    Parameters: string,
    SessionId: number,
    Ip: string | null,
    Headers: string,
}

export function GetDefaultFilter(): ILogActionFilter {
    return {
        UsePeriod: false,
        DateFrom: moment().add(-2, "h").format("YYYY-MM-DD HH:mm:ss"),
        DateTo: moment().add(1, "h").format("YYYY-MM-DD HH:mm:ss"),
        UserId: null,
        ActionName: null,
        SessionId: null,
        Page: 1,
        ItemsPerPage: 10,
        SortColumn: "Id",
        SortDirection: Desc,
        ActionType: undefined,
        Date: undefined,
        EntityType: undefined,
        Id: undefined,
    };
}
