import { IDictionaryItem } from "../Inventory/types";
import { IEquipmentDictionaries } from "../Equipment/types";
import { IFile } from "../Common/types";
import { IIncident } from "../Incident/types";

export interface IKnowledgeBase {
    IsLoading: boolean;
    Dictionaries: IKnowledgeBaseDictionaries;
    Folders: IFolder[];
    Articles: IArticle[];
    ArticleFiles: IFile[];
    Filter: IKnowledgeBaseFilter;
}

export interface IArticle {
    Id: number | null;
    IdFolder: number;
    Title?: string;
    Description?: string;
    Solution?: string;
    Folder?: IFolder;
    Files?: File[];

    AttackTypeTags?: number[];
    EquipmentTypeTags?: number[];
    PlatformTags?: number[];
    MemoryTags?: number[];
    CPUTags?: number[];
    RaidTags?: number[];
    HddTags?: number[];
    NetworkAdapterTags?: number[];
    SoftwareTags?: number[];
    OSTags?: number[];
    BaseIncidentId?: number;
}

export class Article implements IArticle {
    public Id = null;
    public IdFolder = 0;
    public Title = "";
    public Description = "";
    public Solution = "";
    public Folder;
    public Files = [];

    public AttackTypeTags = [];
    public EquipmentTypeTags = [];
    public PlatformTags = [];
    public MemoryTags = [];
    public CPUTags = [];
    public RaidTags = [];
    public HddTags = [];
    public NetworkAdapterTags = [];
    public SoftwareTags = [];
    public OSTags = [];
}

export interface IFolder {
    Id: number;
    IdParent?: number;
    Title?: string;
    Articles?: IArticle[];
}

export interface IKnowledgeBaseDictionaries extends IEquipmentDictionaries {
    AttackTypes: IDictionaryItem[];
}

export interface ITag {
    IdArticle: number;
    IdTag: number;
}

export interface IIncidentArticle {
    IncidentId: number;
    ArticleId: number;
    Type: number;
    Incident?: IIncident;
}

export interface IKnowledgeBaseFilter {
    AttackTypeId?: number;
    EquipmentTypeId?: number;
    PlatformId?: number;
    MemoryId?: number;
    CpuId?: number;
    Raid?: number;
    HDD?: number;
    NetworkAdapter?: number;
    Software?: number;
    OS?: number;
    Query?: string;
}

export function GetDefaultFilter(): IKnowledgeBaseFilter {
    return {
        AttackTypeId: undefined,
        EquipmentTypeId: undefined,
        PlatformId: undefined,
        MemoryId: undefined,
        CpuId: undefined,
        Raid: undefined,
        HDD: undefined,
        NetworkAdapter: undefined,
        Software: undefined,
        OS: undefined
    };
}
