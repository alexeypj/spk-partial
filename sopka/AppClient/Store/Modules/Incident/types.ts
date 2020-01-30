import { IEquipmentListItem, IDictionaryItem, IDictionaryStringItem } from "../../../Store/Modules/Inventory/types";
import { IAppRole } from "../Common/types";
import { ITableFilter } from "../../../Shared/Datatable/types";

export interface IIncidentCreationState {
    CreationDictionaries: IIncidentCreationDictionaries;
    FilterDictionaries: IIncidentFilterDictionaries;
    IncidentList: IIncidentListItem[];
    IncidentsTotal: number;
    Filter: IIncidentListFilter;
    IncidentListTotalItems: number;
    Incident: IIncident | null;
    Statuses: IIncidentStatus[];
    Loading: {
      IsLoading: boolean;
      IsRelatedArticlesLoading: boolean;
      IsArticlePreviewLoading: boolean;
      IsArticleAttaching: boolean;
      IsIncidentLoading: boolean;
      IsIncidentSaving: boolean;
    };
}

export interface IIncidentCreationDictionaries {
    Equipments: IEquipmentListItem[];
    Attacks: IDictionaryItem[];
    Incidents: IIncidentListItem[];
    Countries: IDictionaryItem[];
    Objects: IDictionaryItem[];
    Platforms: IDictionaryItem[];
    Roles: IDictionaryItem[];
    Users: IDictionaryItem[];
    Severity: IDictionaryItem[];
}

export interface IIncident {
    Id: number;
    Title?: string;
    AttackType?: number;
    FixationTime?: Date | string;
    DecisionTime?: Date | string;
    Description?: string;
    DetectionMethod?: string;
    SourceIP?: string;
    SourceURL?: string;
    SourceCountry?: string;
    SourceAddress?: string;
    SourceEquipmentId?: number;
    Criticality?: number;
    RelatedIncidents: number[];
    IdStatus?: number;
    Status?: IIncidentStatus;
    BlockingRecommendations?: string;
    MitigationRecommendations?: string;
    PreventionRecommendations?: string;
    Files?: File[];
}

export interface IIncidentStatus {
  Id: number;
  Name: string;
  Responsible: string;
  ResponsibleRole?: IAppRole;
  StatusType?: number;
  Transitions?: IIncidentStatusTransition[];
}

export interface IIncidentStatusTransition {
  InitialStatusId: number;
  FinalStatusId: number;
  ButtonContent: string;
}

export interface IIncidentFilterDictionaries {
  Users: IDictionaryStringItem[];
  Roles: IDictionaryStringItem[];
  Attacks: IDictionaryItem[];
  Equipments: IDictionaryItem[];
  Objects: IDictionaryItem[];
  Platforms: IDictionaryItem[];
  Countries: IDictionaryItem[];
}

export interface IIncidentListFilter extends ITableFilter {
  Id?: number;
  Title?: string;
  AttackType?: number;
  FixationTime?: Date;
  Status?: number;
  ResponsibleRoleId?: string;
  CreatorId?: string;
  ObjectId?: number;
  EquipmentId?: number;
  PlatformId?: number;
  Country?: string;
  SourceIP?: string;
  ShowClosed?: boolean;
}

export function GetDefaultFilter(): IIncidentListFilter {
  return {
    AttackType: undefined,
    Title: undefined,
    FixationTime: undefined,
    Status: undefined,
    ResponsibleRoleId: undefined,
    CreatorId: undefined,
    ObjectId: undefined,
    EquipmentId: undefined,
    PlatformId: undefined,
    Country: undefined,
    ShowClosed: false,
    Page: 1,
    ItemsPerPage: 15,
    SortColumn: "Id",
    SortDirection: "DESC"
  };
}

export interface IIncidentListItem {
  Id: number;
  AttackType: number;
  AttackTypeName: string;
  FixationTime: Date;
  FixationTimeFormatted?: string;
}

export interface IIncidentStatusHistory {
    Id: number;
    IdIncident: number;
    IdUser: string;
    ChangeTime: Date;
    OldStatusId?: number;
    NewStatusId: number;
    NewComment: string;
    FieldHistory?: IIncidentFieldHistory[];
}

export interface IIncidentFieldHistory {
  Id: number;
  IdIncidentStatusHistory: number;
  NewVal: string;
  OldVal: string;
  FieldName: string;
  IdUser: string;
  ChangeDate: Date;
}

export interface IKnowledgeBaseIncidentMatch {
  ArticleId: number;
  ArticleName: string;
  MatchTags: string[];
}

export enum TagsMap {
  AttackType = "Тип атаки",
  EquipmentType = "Тип оборудования",
  Platforms = "Платформа",
  Memory = "Память",
  CPU = "Процессор",
  Raids = "Тип рейда",
  HDD = "Жесткий диск",
  NetworkAdapters = "Сетевой адаптер",
  Software = "ПО",
  OS = "Системное ПО"
}

export interface IIncidentStatistic { 
    Title: string,
    Period: string,
    GroupType: string,
    Statistic: IDictionaryItem[],
}

export interface IIncidentStatisticFilter {
    Period: string,
    GroupType: string,
    DateFrom: string | Date,
    DateTo: string | Date
}

export interface IIncidentHistoryFilter extends ITableFilter {
  Id: number;
  Title?: string;
  AttackType?: number;
  FixationTime?: Date;
  Status?: number;
  ResponsibleRoleId?: string;
  CreatorId?: string;
  ObjectId?: number;
  EquipmentId?: number;
  PlatformId?: number;
  Country?: string;
  SourceIP?: string;
  ShowClosed?: boolean;
}

export function GetDefaultHistoryFilter(id: number): IIncidentHistoryFilter {
  return {
    AttackType: undefined,
    Title: undefined,
    FixationTime: undefined,
    Status: undefined,
    ResponsibleRoleId: undefined,
    CreatorId: undefined,
    ObjectId: undefined,
    EquipmentId: undefined,
    PlatformId: undefined,
    Country: undefined,
    ShowClosed: false,
    Id: id,
    Page: 1,
    ItemsPerPage: 15,
    SortColumn: "Id",
    SortDirection: "DESC"
  };
}

export interface IIncidentHistoryRecord {
  Id: number;
  Field: string;
  NewValue: string;
  OldValue: string;
  ChangeDate: string;
  User: string;
  Comment: string;
}
