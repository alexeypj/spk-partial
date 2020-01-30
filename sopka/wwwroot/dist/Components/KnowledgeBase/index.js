var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Details from "./Details/details.vue";
import FolderForm from "./FolderForm/folderForm.vue";
import { Article, GetDefaultFilter } from "../../Store/Modules/KnowledgeBase/types";
import { Action, Getter, Mutation } from "vuex-class";
import { Actions, namespace, Getters, Mutations } from "../../Store/Modules/KnowledgeBase/constants";
import { volumeDict, networkAdaptersDict } from "../../Store/Modules/Equipment/types";
import Tree from "./Tree/tree.vue";
import Modal from "../../Shared/Modals/modal.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
let KnowledgeBase = class KnowledgeBase extends Vue {
    constructor() {
        super(...arguments);
        this.showFolderForm = false;
        this.selectedFolderId = null;
        this.leftPanelContent = LeftPanelContent.Filters;
        this.folderModel = { Id: 0, Title: "", IdParent: undefined };
        this.errorText = "";
        this.isSaved = false;
        this.selectedArticle = new Article();
        this.baseIncidentId = null;
        this.filter = GetDefaultFilter();
    }
    onIdChange(newVal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newVal) {
                if (newVal !== 0) {
                    if (this.isFilters) {
                        this.showTree();
                    }
                    this.openTreeArticle(newVal);
                    logAction(LogActions.KnowledgeBaseArticle, EntityType.Article, newVal.toString());
                }
                else {
                    logAction(LogActions.KnowledgeBaseArticleCreateForm);
                }
            }
            else {
                logAction(LogActions.KnowledgeBaseIndex);
                this.selectedArticle = new Article();
                this.leftPanelContent = LeftPanelContent.Filters;
            }
        });
    }
    mounted() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Filter", this.Filter);
            this.filter = Object.assign({}, this.Filter);
            console.log(this.filter);
            const query = this.$router.currentRoute.query;
            if (query && query.incidentId) {
                this.baseIncidentId = Number(query.incidentId);
            }
            yield Promise.all([this.FetchFolders(), this.FetchDictionaries(), this.FetchArticles(this.filter)])
                .then(() => this.openTreeArticle(this.selectedArticle.Id));
            if (this.Id) {
                yield this.selectFile(this.Id.toString());
            }
        });
    }
    create() {
        this.selectedArticle = new Article();
        this.selectedArticle.Id = 0;
        this.selectedArticle.IdFolder = (this.selectedFolderId && this.selectedFolderId.length > 0) ? Number(this.selectedFolderId[0]) : 0;
        this.$router.push({ path: "/KnowledgeBase/0" });
    }
    openFolderForm() {
        this.showFolderForm = true;
        this.folderModel = { Id: 0 };
    }
    closeFolderForm() {
        this.showFolderForm = false;
    }
    storeFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.closeFolderForm();
                yield this.StoreFolder(this.folderModel);
                this.isSaved = true;
                setTimeout(() => this.isSaved = false, 5000);
                yield this.FetchFolders();
            }
            catch (error) {
                this.errorText = error;
            }
        });
    }
    get memoryDict() {
        return volumeDict(this.Dictionaries.Memory);
    }
    get networkAdaptersDict() {
        return networkAdaptersDict(this.Dictionaries.NetworkAdapters);
    }
    get hddDict() {
        return volumeDict(this.Dictionaries.HDD);
    }
    get isFilters() {
        if (this.leftPanelContent === LeftPanelContent.Filters) {
            return true;
        }
        return false;
    }
    get isTree() {
        if (this.leftPanelContent === LeftPanelContent.Tree) {
            return true;
        }
        return false;
    }
    get isList() {
        if (this.leftPanelContent === LeftPanelContent.List) {
            return true;
        }
        return false;
    }
    showFilters() {
        this.leftPanelContent = LeftPanelContent.Filters;
    }
    showTree() {
        this.leftPanelContent = LeftPanelContent.Tree;
    }
    showList() {
        this.leftPanelContent = LeftPanelContent.List;
    }
    selectFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id === "string") {
                if (id.startsWith("article_")) {
                    id = id.replace("article_", "");
                }
            }
            else {
                id = id.toString();
            }
            if (id !== "0") {
                this.selectedArticle = yield this.FetchArticle(Number(id));
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
            }
            else {
                this.selectedArticle = new Article();
                this.$set(this.selectedArticle, "Id", 0);
                this.$set(this.selectedArticle, "IdFolder", (this.selectedFolderId && this.selectedFolderId.length > 0) ?
                    Number(this.selectedFolderId[0]) : 0);
            }
            const query = this.$router.currentRoute.query;
            if (this.Id && this.Id > 0) {
                this.baseIncidentId = null;
                this.$router.push({ path: "/KnowledgeBase/" + id });
            }
            else {
                this.$router.push({ path: "/KnowledgeBase/" + id, query: Object.assign({}, query) });
            }
            if (this.isFilters) {
                this.showTree();
            }
            this.$nextTick(() => this.openTreeArticle(this.selectedArticle.Id));
        });
    }
    onArticleStored(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.FetchArticles(this.filter);
            this.selectFile(id.toString());
            this.openTreeArticle(id);
        });
    }
    /** Открытие статьи в дереве */
    openTreeArticle(id, type = "article") {
        if (id) {
            const element = (type === "article") ? "article_" + id.toString() : id.toString();
            this.$emit("openArticle", element, "leftPanelFolder");
        }
    }
    /** Отображается статья */
    get showingArticle() {
        return this.selectedArticle.Id != null;
    }
    isSelected(id) {
        return id === this.selectedArticle.Id;
    }
    applyFilter(filter) {
        if (filter) {
            this.filter = filter;
            this.SetFilter(filter);
            this.FetchArticles(this.filter);
        }
    }
    resetFilter() {
        this.filter = GetDefaultFilter();
        this.SetFilter(this.filter);
        this.FetchArticles(this.filter);
    }
};
__decorate([
    Prop()
], KnowledgeBase.prototype, "Id", void 0);
__decorate([
    Watch("Id")
], KnowledgeBase.prototype, "onIdChange", null);
__decorate([
    Action(Actions.STORE_FOLDER, { namespace })
], KnowledgeBase.prototype, "StoreFolder", void 0);
__decorate([
    Action(Actions.FETCH_FOLDERS, { namespace })
], KnowledgeBase.prototype, "FetchFolders", void 0);
__decorate([
    Getter(Getters.DICTIONARIES, { namespace })
], KnowledgeBase.prototype, "Dictionaries", void 0);
__decorate([
    Action(Actions.FETCH_DICTIONARIES, { namespace })
], KnowledgeBase.prototype, "FetchDictionaries", void 0);
__decorate([
    Action(Actions.FETCH_ARTICLES, { namespace })
], KnowledgeBase.prototype, "FetchArticles", void 0);
__decorate([
    Action(Actions.FETCH_ARTICLE, { namespace })
], KnowledgeBase.prototype, "FetchArticle", void 0);
__decorate([
    Getter(Getters.FOLDERS, { namespace })
], KnowledgeBase.prototype, "Folders", void 0);
__decorate([
    Getter(Getters.JSTREE_FULL, { namespace })
], KnowledgeBase.prototype, "JSTree", void 0);
__decorate([
    Getter(Getters.ARTICLES, { namespace })
], KnowledgeBase.prototype, "Articles", void 0);
__decorate([
    Getter(Getters.CURRENT_FILTER, { namespace })
], KnowledgeBase.prototype, "Filter", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace })
], KnowledgeBase.prototype, "SetFilter", void 0);
KnowledgeBase = __decorate([
    Component({
        components: {
            Details,
            FolderForm,
            Tree,
            Modal,
            select2
        }
    })
], KnowledgeBase);
export default KnowledgeBase;
var LeftPanelContent;
(function (LeftPanelContent) {
    LeftPanelContent[LeftPanelContent["Filters"] = 0] = "Filters";
    LeftPanelContent[LeftPanelContent["Tree"] = 1] = "Tree";
    LeftPanelContent[LeftPanelContent["List"] = 2] = "List";
})(LeftPanelContent || (LeftPanelContent = {}));
//# sourceMappingURL=index.js.map