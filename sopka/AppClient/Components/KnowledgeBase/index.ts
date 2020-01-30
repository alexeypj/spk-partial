import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Details from "./Details/details.vue";
import FolderForm from "./FolderForm/folderForm.vue";
import {
    IFolder,
    IKnowledgeBaseDictionaries,
    IArticle,
    Article,
    IKnowledgeBaseFilter,
    GetDefaultFilter
} from "../../Store/Modules/KnowledgeBase/types";
import { Action, Getter, Mutation } from "vuex-class";
import { Actions, namespace, Getters, Mutations } from "../../Store/Modules/KnowledgeBase/constants";
import { volumeDict, networkAdaptersDict } from "../../Store/Modules/Equipment/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";
import Tree from "./Tree/tree.vue";
import Modal from "../../Shared/Modals/modal.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { IJSTreeItem } from "../..//Store/Modules/Common/types";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
import DirectoryEquipmentTypesIndex = LogActions.DirectoryEquipmentTypesIndex;
import { Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";

@Component({
    components: {
        Details,
        FolderForm,
        Tree,
        Modal,
        select2
    }
})
export default class KnowledgeBase extends Vue {

    @Prop()
    public readonly Id: number | undefined;

    @Watch("Id")
    public async onIdChange(newVal: number | undefined): Promise<void> {
        if (newVal) {
            if (newVal !== 0) {
                if (this.isFilters) {
                    this.showTree();
                }
                this.openTreeArticle(newVal);
            } else {
                logAction(LogActions.KnowledgeBaseArticleCreateForm);
            }
        } else {
            logAction(LogActions.KnowledgeBaseIndex);
            this.selectedArticle = new Article();
            this.leftPanelContent = LeftPanelContent.Filters;
        }
    }

    @Action(Actions.STORE_FOLDER, { namespace })
    public StoreFolder: (model: IFolder) => Promise<IFolder>;

    @Action(Actions.FETCH_FOLDERS, { namespace })
    public FetchFolders: () => Promise<IFolder[]>;

    @Getter(Getters.DICTIONARIES, { namespace })
    public readonly Dictionaries: IKnowledgeBaseDictionaries;

    @Action(Actions.FETCH_DICTIONARIES, { namespace })
    public FetchDictionaries: () => Promise<IKnowledgeBaseDictionaries>;

    @Action(Actions.FETCH_ARTICLES, { namespace })
    public FetchArticles: (filter: IKnowledgeBaseFilter) => Promise<IArticle>;

    @Action(Actions.FETCH_ARTICLE, { namespace })
    public FetchArticle: (id: number) => Promise<IArticle>;

    @Getter(Getters.FOLDERS, { namespace })
    public readonly Folders: IFolder[];

    @Getter(Getters.JSTREE_FULL, { namespace })
    public readonly JSTree: IJSTreeItem[];

    @Getter(Getters.ARTICLES, { namespace })
    public readonly Articles: IArticle[];

    @Getter(Getters.CURRENT_FILTER, { namespace })
    public readonly Filter: IKnowledgeBaseFilter;

    @Mutation(Mutations.SET_FILTER, { namespace })
    public SetFilter: (filter: IKnowledgeBaseFilter) => void;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    private showFolderForm: boolean = false;
    private selectedFolderId: string | null = null;

    private leftPanelContent: LeftPanelContent = LeftPanelContent.Filters;
    private centerContent: LeftPanelContent = LeftPanelContent.List;

    public folderModel: IFolder = { Id: 0, Title: "", IdParent: undefined };

    private errorText: string = "";
    private isSaved: boolean = false;
    private selectedArticle: IArticle = new Article();
    private baseIncidentId: number | null = null;
    private filter: IKnowledgeBaseFilter = GetDefaultFilter();

    public async mounted() {
        this.filter = { ...this.Filter };
        const query = this.$router.currentRoute.query;
        if (query && query.incidentId) {
            this.baseIncidentId = Number(query.incidentId);
        }

        await Promise.all([this.FetchFolders(), this.FetchDictionaries(), this.FetchArticles(this.filter)])
            .then(() => this.openTreeArticle(this.selectedArticle.Id));

        if (this.Id) {
            await this.selectFile(this.Id.toString());
        } else {
            logAction(LogActions.KnowledgeBaseIndex);
        }
    }

    public create(): void {
        this.selectedArticle = new Article();
        this.selectedArticle.Id = 0;
        this.selectedArticle.IdFolder = (this.selectedFolderId && this.selectedFolderId.length > 0)
            ? Number(this.selectedFolderId[0])
            : 0;
        this.$router.push({ path: "/KnowledgeBase/0" });
    }

    public openFolderForm(): void {
        this.showFolderForm = true;
        this.folderModel = { Id: 0 };
    }

    public closeFolderForm(): void {
        this.showFolderForm = false;
    }

    public storeFolder(): void {
        try {
            const folderForm = this.$refs.folderForm as any;
            folderForm.$validator.validateAll().then(async (result) => {
                if (result) {
                    this.closeFolderForm();
                    await this.StoreFolder(this.folderModel);
                    this.isSaved = true;
                    setTimeout(() => this.isSaved = false, 5000);
                    await this.FetchFolders();
                }
            });
        } catch (error) {
            this.errorText = error;
        }
    }

    public get memoryDict(): IDictionaryItem[] {
        return volumeDict(this.Dictionaries.Memory);
    }

    public get networkAdaptersDict(): IDictionaryItem[] {
        return networkAdaptersDict(this.Dictionaries.NetworkAdapters);
    }

    public get hddDict(): IDictionaryItem[] {
        return volumeDict(this.Dictionaries.HDD);
    }

    public get isFilters(): boolean {
        if (this.leftPanelContent === LeftPanelContent.Filters) {
            return true;
        }
        return false;
    }

    public get isTree(): boolean {
        if (this.leftPanelContent === LeftPanelContent.Tree) {
            return true;
        }
        return false;
    }

    public get isList(): boolean {
        if (this.leftPanelContent === LeftPanelContent.List) {
            return true;
        }
        return false;
    }

    public showFilters(): void {
        this.leftPanelContent = LeftPanelContent.Filters;
    }

    public showTree(): void {
        this.leftPanelContent = LeftPanelContent.Tree;
    }

    public showList(): void {
        this.leftPanelContent = LeftPanelContent.List;
    }

    public async selectFile(id: string | number) {
        if (typeof id === "string") {
            if (id.startsWith("article_")) {
                id = id.replace("article_", "");
            }
        } else {
            id = id.toString();
        }

        if (id !== "0") {
            this.selectedArticle = await this.FetchArticle(Number(id));

            if (!this.selectedArticle.AttackTypeTags) {
                this.selectedArticle.AttackTypeTags = [];
            }
            if (!this.selectedArticle.EquipmentTypeTags) {
                this.selectedArticle.EquipmentTypeTags = [];
            }
            if (!this.selectedArticle.PlatformTags) {
                this.selectedArticle.PlatformTags = [];
            }
            if (!this.selectedArticle.MemoryTags) {
                this.selectedArticle.MemoryTags = [];
            }
            if (!this.selectedArticle.CPUTags) {
                this.selectedArticle.CPUTags = [];
            }
            if (!this.selectedArticle.RaidTags) {
                this.selectedArticle.RaidTags = [];
            }
            if (!this.selectedArticle.HddTags) {
                this.selectedArticle.HddTags = [];
            }
            if (!this.selectedArticle.NetworkAdapterTags) {
                this.selectedArticle.NetworkAdapterTags = [];
            }
            if (!this.selectedArticle.SoftwareTags) {
                this.selectedArticle.SoftwareTags = [];
            }
            if (!this.selectedArticle.OSTags) {
                this.selectedArticle.OSTags = [];
            }
            logAction(LogActions.KnowledgeBaseArticle, EntityType.Article,
                this.selectedArticle.Id && this.selectedArticle.Id.toString() || null, null, this.selectedArticle.Title);
        } else {
            this.selectedArticle = new Article();
            this.$set(this.selectedArticle, "Id", 0);
            this.$set(this.selectedArticle,
                "IdFolder",
                (this.selectedFolderId && this.selectedFolderId.length > 0) ? Number(this.selectedFolderId[0]) : 0);
        }

        const query = this.$router.currentRoute.query;
        if (this.Id && this.Id > 0) {
            this.baseIncidentId = null;
            this.$router.push({ path: "/KnowledgeBase/" + id });
        } else {
            this.$router.push({ path: "/KnowledgeBase/" + id, query: { ...query } });
        }
        if (this.isFilters) {
            this.showTree();
        }
        this.$nextTick(() => this.openTreeArticle(this.selectedArticle.Id));
    }

    private async onArticleStored(id: number): Promise<void> {
        await this.FetchArticles(this.filter);
        this.selectFile(id.toString());
        this.openTreeArticle(id);
    }

    /** Открытие статьи в дереве */
    private openTreeArticle(id: number | null, type: string = "article") {
        if (id) {
            const element = (type === "article") ? "article_" + id.toString() : id.toString();
            this.$emit("openArticle", element, "leftPanelFolder");
        }
    }

    /** Отображается статья */
    public get showingArticle(): boolean {
        return this.selectedArticle.Id != null;
    }

    public isSelected(id: number): boolean {
        return id === this.selectedArticle.Id;
    }

    public applyFilter(filter: IKnowledgeBaseFilter): void {
        if (filter) {
            this.filter = filter;
            this.SetFilter(filter);
            this.FetchArticles(this.filter);
            this.centerContent = LeftPanelContent.List;
        }
    }

    private timeoutId?: any;
    public delayedApplyFilter(filter): void {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
                this.applyFilter(filter);
            }, 500);
    }

    public resetFilter(): void {
        this.filter = GetDefaultFilter();
        this.SetFilter(this.filter);
        this.FetchArticles(this.filter);
    }

    public onArticleRemoved(folderId: number): void {
        const contentType = this.leftPanelContent;
        this.FetchArticles(this.filter);
        this.$router.push({ path: "/KnowledgeBase/" });
        this.$emit("openArticle", folderId, "leftPanelFolder");
        this.$nextTick(() => this.leftPanelContent = contentType);
    }

    public showListCenter(): void {
        this.centerContent = LeftPanelContent.List;
    }

    public showTreeCenter(): void {
        this.centerContent = LeftPanelContent.Tree;
    }

    public get isCenterList() {
        return this.centerContent === LeftPanelContent.List;
    }
}

enum LeftPanelContent {
    Filters,
    Tree,
    List
}
