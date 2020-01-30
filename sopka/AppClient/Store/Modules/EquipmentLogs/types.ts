import { ITableFilter } from "../../../Shared/Datatable/types";

export interface IEquipmentLogsState {
    Filter: IEquipmentLogsFilter;
    RulesList: IRule[];
    RulesCount: number;
    Loading: {
        IsLoading: boolean,
        IsSaving: boolean,
        IsOneLoading: boolean
    };
}

export interface ICondition {
    Id: number;
    RuleId: number;
    Position: number;
    EquipmentId?: number;
    SeverityId?: number;
    ErrorBody: string;
    ErrorsNumber: number;
    PeriodLength: number;
    Period: number;
}

export interface IRule {
    Id: number;
    Name: string;
    IsActive: boolean;
    OnCondition: number;
    OnConditionPeriod?: number;
    OnConditionPeriodLength?: number;
    Action: number;
    Conditions: ICondition[];
    EmailAddress?: string;
    Description?: string;
    DateCreate?: Date;
    CreatorId: string;
}

export interface IRuleFormatted extends IRule {
    Text?: string;
    IsActiveText?: string;
}

export interface IEquipmentLogsFilter extends ITableFilter {
    Name?: string;
}

export function createRule(): IRule {
    return {
        Id: 0,
        Name: "",
        IsActive: true,
        OnCondition: 0,
        Action: 0,
        Conditions: [createCondition(0)],
        EmailAddress: undefined,
        Description: undefined,
        DateCreate: undefined,
        CreatorId: "",
        OnConditionPeriod: 0
    };
}

export function createCondition(position: number): ICondition {
    return {
        Id: 0,
        RuleId: 0,
        Position: position,
        EquipmentId: undefined,
        SeverityId: undefined,
        ErrorBody: "",
        ErrorsNumber: 0,
        PeriodLength: 0,
        Period: 0
    };
}

export function createFilter(): IEquipmentLogsFilter {
    return {
        Name: "",
        Page: 1,
        ItemsPerPage: 20,
        SortColumn: "Id",
        SortDirection: "DESC"
    };
}

export enum OnConditions {
    "хотя бы одно" = 0,
    "все" = 1,
    "все в определенном порядке" = 2
}

export enum Actions  {
    "Создать инцидент" = 0,
    "Отправить письмо на почту" = 1
}

export enum TimePeriods {
    "секунды" = 0,
    "минуты" = 1,
    "часы" = 2
}
