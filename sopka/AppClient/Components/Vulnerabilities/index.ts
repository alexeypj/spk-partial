import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Details from "./Details/details.vue";
import {
   IVulnerability,
   IVulnerabilityFolder,
   IFilter,
   StatusDictionary
} from "../../Store/Modules/Vulnerabilities/types";
import { Action, Getter, Mutation } from "vuex-class";
import { Actions, namespace, Getters, Mutations } from "../../Store/Modules/Vulnerabilities/constants";
import Tree from "./Tree/tree.vue";
import Modal from "../../Shared/Modals/modal.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { IJSTreeItem } from "../..//Store/Modules/Common/types";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
import VulnerabilitiesFilter from "./Filter/vulnerabilitiesFilter.vue";
import { createFilter } from "../../Store/Modules/Vulnerabilities/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";

@Component({
    components: {
      Details,
      Tree,
      Modal,
      select2,
      VulnerabilitiesFilter
    }
})
export default class Vulnerabilities extends Vue {

    @Prop()
    public readonly Id: number | undefined;

    @Watch("Id")
    public async onIdChange(newVal: number|undefined): Promise<void> {
        if (newVal) {
            if (newVal !== 0) {
                if (this.isFilters) {
                    this.showTree();
                }
                this.openTreeArticle(newVal);
                // logAction(LogActions.KnowledgeBaseArticle, EntityType.Article, newVal.toString());
            } else {
                // logAction(LogActions.KnowledgeBaseArticleCreateForm);
            }
        } else {
            // logAction(LogActions.KnowledgeBaseIndex);
            this.selectedArticle = <IVulnerability> {
                Id: 0,
                IdFolder: 0,
            };
            this.leftPanelContent = LeftPanelContent.Filters;
        }
    }

    @Action(Actions.FETCH_FOLDERS, { namespace })
    public FetchFolders: () => Promise<IVulnerabilityFolder[]>;

    @Action(Actions.FETCH_VULNERABILITIES, { namespace })
    public FetchVulnerabilities: (filter: IFilter) => Promise<IVulnerability[]>;

    @Action(Actions.FETCH_VULNERABILITY, { namespace })
    public FetchVulnerability: (id: number) => Promise<IVulnerability>;

    @Action(Actions.FETCH_DICTIONARIES, { namespace })
    public FetchDictionaries: () => Promise<any>;

    @Action(Actions.FETCH_FOLDER_CONTENTS, { namespace })
    public FetchFolderContents: (id: number) => Promise<IVulnerability[]>;

    @Getter(Getters.DICTIONARIES, { namespace })
    public readonly Dictionaries: {
        Countries: IDictionaryItem[]
    };

    @Getter(Getters.ARE_DICTIONARIES_LOADING, { namespace })
    public readonly DictionariesLoading: boolean;

    @Getter(Getters.ARE_VULNERABILITIES_LOADING, { namespace })
    public readonly VulnerabilitiesLoading: boolean;

    @Getter(Getters.FOLDERS, { namespace })
    public readonly Folders: IVulnerabilityFolder[];

    @Getter(Getters.JSTREE_FULL, { namespace })
    public readonly JSTree: IJSTreeItem[];

    @Getter(Getters.VULNERABILITIES, { namespace })
    public readonly Vulnerabilities: IVulnerability[];

    @Getter(Getters.CURRENT_FILTER, { namespace })
    public readonly Filter: IFilter;

    @Getter(Getters.IS_FOLDER_CONTENTS_LOADING, { namespace })
    public FolderContentsLoading: boolean;

    @Mutation(Mutations.SET_FILTER, { namespace })
    public SetFilter: (filter: IFilter) => void;

    private leftPanelContent: LeftPanelContent = LeftPanelContent.Filters;
    private centralContent: CentralContent = CentralContent.Tree;

    public folderModel: IVulnerabilityFolder = { Id: 0, Title : "", IdParent: undefined };

    private errorText: string = "";
    private isSaved: boolean = false;
    private selectedArticle: IVulnerability = <IVulnerability> {
        Id: 0,
        IdFolder: 0
    };
    private selectedFolderId: number|null = null;
    private filter: IFilter = createFilter();
    private vulnerabilities: IVulnerability[] = [];

    public async mounted() {
        this.filter = { ...this.Filter };
        const query = this.$router.currentRoute.query;
        const tasks = [this.FetchFolders(), this.FetchVulnerabilities(this.filter)];
        if (this.Dictionaries.Countries.length === 0) {
            tasks.push(this.FetchDictionaries());
        }

        await Promise.all(tasks)
            .then(() => this.openTreeArticle(this.selectedArticle.Id));

        if (this.Id) {
            await this.selectFile(this.Id.toString());
        }        
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
            this.selectedArticle = await this.FetchVulnerability(Number(id));
        }

        const query = this.$router.currentRoute.query;
        if (this.Id && this.Id > 0) {
            this.$router.push({ path: "/Vulnerabilities/" + id });
        } else {
            this.$router.push({ path: "/Vulnerabilities/" + id, query: {...query } });
        }
        if (this.isFilters) {
            this.showTree();
        }
        this.$nextTick(() =>  this.openTreeArticle(this.selectedArticle.Id));
    }

    /** Открытие статьи в дереве */
    private openTreeArticle(id: number | null, type: string = "article") {
        if (id) {
            const element = (type === "article") ? "article_" + id.toString() : id.toString();
            this.$emit("openArticle", element, "leftPanelFolder");
            this.centralContent = CentralContent.Vulnerability;
        }
    }

    /** Отображается статья */
    public get showingArticle(): boolean {
        return this.centralContent === CentralContent.Vulnerability;
    }

    public get showingTree(): boolean {
        return this.centralContent === CentralContent.Tree;
    }

    public get showingList(): boolean {
        return this.centralContent === CentralContent.List;
    }

    public isSelected(id: number): boolean {
        return id === this.selectedArticle.Id;
    }

    public async applyFilter(filter: IFilter) {
        if (filter) {
            this.filter = filter;
            this.SetFilter(filter);
            this.centralContent = CentralContent.List;
            this.vulnerabilities = await this.FetchVulnerabilities(this.filter);
        }
    }

    public resetFilter(): void {
        this.filter = createFilter();
        this.SetFilter(this.filter);
        this.FetchVulnerabilities(this.filter);
    }

    public async openFolder(id: number): Promise<void> {
        this.centralContent = CentralContent.List;
        // this.selectedFolderId = Number(id);
        this.$emit("openArticle", id.toString(), "leftPanelFolder");
        this.vulnerabilities = await this.FetchFolderContents(id);
        this.selectedFolderId = id;
    }

    public get folderName(): string {
        if (this.selectedFolderId) {
            const folder = this.Folders.find(x => x.Id === this.selectedFolderId);
            if (folder) {
                return folder.Title || "";
            }
        }
        return "";
    }

    public getStatus(id: number): string {
        return StatusDictionary[id];
    }

    public getStatusColor(id: number): string {
        switch (id) {
            case 0: return "status-new";
            case 1: return "status-inwork";
            case 2: return "status-error";
            case 3: return "status-workedout";
        }
        return "";
    }
}

enum LeftPanelContent {
    Filters,
    Tree,
    List
}

enum CentralContent {
    Vulnerability,
    List,
    Tree
}
