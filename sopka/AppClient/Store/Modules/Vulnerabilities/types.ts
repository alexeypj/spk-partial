import { formatDate } from "../../../Shared/utils";
import { IDictionaryItem } from "../Inventory/types";

export interface IVulnerabilities {
    Filter: IFilter;
    Folders: IVulnerabilityFolder[];
    Vulnerabilities: IVulnerability[];
    SelectedVulnerability: IVulnerability|null;
    Dictionaries: {
        Countries: IDictionaryItem[],
        Regulations: IDictionaryItem[],
        Manufacturers: IDictionaryItem[],
        Incidents: IDictionaryItem[],
        Resources: IDictionaryItem[],
        Research: IDictionaryItem[]
    };
    Loading: {
        AreFoldersLoading: boolean,
        AreVulnerabilitiesLoading: boolean;
        IsVulnerabilityLoading: boolean;
        DictionariesLoading: boolean;
        CommentsLoading: boolean;
        CommentStoring: boolean;
        StatusStoring: boolean;
        FolderContentsLoading: boolean;
    };
}

export interface IFilter {
    UseCreateDate: boolean;
    CreateDateFrom?: string;
    CreateDateTo?: string;
    Status?: number;
    Countries: string[];
    Regulations: string[];
    Manufacturers: string[];
    Research: string[];
    Incidents: string[];
    Resources: string[];
}

export function createFilter(): IFilter {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return <IFilter> {
        UseCreateDate: false,
        CreateDateFrom: formatDate(new Date()),
        CreateDateTo: formatDate(tomorrow),
        Status: undefined,
        Countries: [],
        Regulations: [],
        Manufacturers: [],
        Research: [],
        Incidents: [],
        Resources: []
    };
}

export const StatusDictionary = {
    0: "Новый",
    1: "В работе",
    2: "Ошибочный",
    3: "Отработанный"
};

export interface IVulnerability {
    Id: number;
    IdFolder: number;
    Title?: string;
    CreateDate?: Date;
    StatusType: number;
    Country?: string;
    Manufacturer?: string;
    Regulations?: string;
    Research?: string;
    Incidents?: string;
    Resources?: string;
    TranslationFileId?: number;
    OriginalFileId?: number;
}

export interface IVulnerabilityFolder {
    Id: number;
    IdParent?: number;
    Title?: string;
    Articles?: IVulnerability[];
}

export interface IVulnerabilityComment {
    Id: number;
    VulnerabilityId: number;
    CreateDate: Date;
    UserId: string;
    Comment: string;
}
