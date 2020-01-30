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
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { namespace, Getters, Actions } from "../../../../Store/Modules/Incident/constants";
import { TagsMap } from "../../../../Store/Modules/Incident/types";
import { namespace as commonNamespace, Actions as commonActions } from "../../../../Store/Modules/Common/constants";
import { urlHelper } from "../../../../Shared/utils";
import { Getters as articleGetters, Actions as articleActions, namespace as articleNamespace, } from "../../../../Store/Modules/KnowledgeBase/constants";
let KbArticles = class KbArticles extends Vue {
    constructor() {
        super(...arguments);
        this.kbMatches = [];
        this.articlePreview = null;
        this.articlePreviewFiles = [];
        this.incidentArticles = [];
    }
    mounted() {
        if (this.Dictionaries.AttackTypes.length === 0) {
            this.FetchDictionaries();
        }
        this.loadArticles();
        this.FetchAttachedActions(this.IncidentId)
            .then(result => this.incidentArticles = result);
    }
    loadArticles() {
        return __awaiter(this, void 0, void 0, function* () {
            this.kbMatches = yield this.FetchRelatedArticles({ incidentId: this.IncidentId, excludeArticles: this.getRemovedMatches() });
        });
    }
    getMatchList(tags) {
        if (tags) {
            const tagNames = [];
            for (const tag of tags) {
                tagNames.push(TagsMap[tag]);
            }
            return tagNames.join(", ");
        }
        return "";
    }
    getRemovedMatches() {
        const removedMatches = this.getMatchesFromStorage();
        if (removedMatches && removedMatches[this.IncidentId]) {
            return removedMatches[this.IncidentId];
        }
        return [];
    }
    removeMatchFromArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const removedMatches = this.getMatchesFromStorage();
            if (removedMatches[this.IncidentId]) {
                const incidentMatches = removedMatches[this.IncidentId];
                if (incidentMatches.indexOf(articleId) === -1) {
                    incidentMatches.push(articleId);
                }
            }
            else {
                removedMatches[this.IncidentId] = [articleId];
            }
            this.storeMatches(removedMatches);
            // this.showRelatedArticles();
            yield this.loadArticles();
        });
    }
    removeMatchesFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const removedMatches = this.getMatchesFromStorage();
            removedMatches[this.IncidentId] = [];
            this.storeMatches(removedMatches);
            // this.showRelatedArticles();
            yield this.loadArticles();
        });
    }
    getMatchesFromStorage() {
        try {
            const matches = localStorage.getItem("INCIDENT_REMOVED_MATCHES");
            if (matches) {
                return JSON.parse(matches);
            }
            return {};
        }
        catch (error) {
            console.warn(error);
            localStorage.removeItem("INCIDENT_REMOVED_MATCHES");
            return {};
        }
    }
    storeMatches(matches) {
        localStorage.setItem("INCIDENT_REMOVED_MATCHES", JSON.stringify(matches));
    }
    get showArticlePreview() {
        return this.articlePreview !== null;
    }
    openArticleInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [article, files] = yield Promise.all([this.FetchArticlePreview(id), this.FetchFiles({ id, type: "article" })]);
            this.articlePreview = article;
            this.articlePreviewFiles = files;
        });
    }
    closePreview() {
        this.articlePreview = null;
        this.articlePreviewFiles = [];
    }
    openFile(file) {
        if (file) {
            window.open(urlHelper(`${file.Id}`, "FilePreview"));
        }
    }
    attachArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.articlePreview != null) {
                this.AttachArticle({ incidentId: this.IncidentId, articleId })
                    .then(x => this.FetchAttachedActions(this.IncidentId)
                    .then((result) => this.incidentArticles = result));
            }
        });
    }
    detachArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.articlePreview != null) {
                this.DetachArticle({ incidentId: this.IncidentId, articleId })
                    .then(x => this.FetchAttachedActions(this.IncidentId)
                    .then((result) => this.incidentArticles = result));
            }
        });
    }
    getTags() {
        if (this.articlePreview) {
            const tags = [];
            tags.push(...this.getDictionaryValues(this.Dictionaries.AttackTypes, this.articlePreview.AttackTypeTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.DeviceTypes, this.articlePreview.EquipmentTypeTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.Platforms, this.articlePreview.PlatformTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.Memory, this.articlePreview.MemoryTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.CPU, this.articlePreview.CPUTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.RaidTypes, this.articlePreview.RaidTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.HDD, this.articlePreview.HddTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.NetworkAdapters, this.articlePreview.NetworkAdapterTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.Software, this.articlePreview.SoftwareTags));
            tags.push(...this.getDictionaryValues(this.Dictionaries.OS, this.articlePreview.OSTags));
            return tags.join(", ");
        }
        return "";
    }
    getDictionaryValues(dictionary, values) {
        if (dictionary && values) {
            const result = [];
            for (const value of values) {
                const dictValue = dictionary.find(x => x.Key === value);
                if (dictValue) {
                    result.push(dictValue.Value);
                }
            }
            return result;
        }
        return [];
    }
    isAttached(id) {
        return this.incidentArticles.find(x => x.ArticleId === id) !== undefined;
    }
    get isTextOverflow() {
        if (this.articlePreview != null) {
            let result = false;
            if (this.articlePreview.Description && this.articlePreview.Description.length >= 200) {
                result = true;
            }
            if (!result && this.articlePreview.Solution && this.articlePreview.Solution.length >= 200) {
                result = true;
            }
            return result;
        }
        return false;
    }
};
__decorate([
    Prop({ required: true })
], KbArticles.prototype, "IncidentId", void 0);
__decorate([
    Action(Actions.FETCH_RELATED_ARTICLES, { namespace })
], KbArticles.prototype, "FetchRelatedArticles", void 0);
__decorate([
    Action(Actions.FETCH_ARTICLE_PREVIEW, { namespace })
], KbArticles.prototype, "FetchArticlePreview", void 0);
__decorate([
    Action(commonActions.FETCH_FILE_LIST, { namespace: commonNamespace })
], KbArticles.prototype, "FetchFiles", void 0);
__decorate([
    Action(Actions.ATTACH_ARTICLE_TO_INCIDENT, { namespace })
], KbArticles.prototype, "AttachArticle", void 0);
__decorate([
    Action(Actions.DETACH_ARTICLE_FROM_INCIDENT, { namespace })
], KbArticles.prototype, "DetachArticle", void 0);
__decorate([
    Action(articleActions.FETCH_DICTIONARIES, { namespace: articleNamespace })
], KbArticles.prototype, "FetchDictionaries", void 0);
__decorate([
    Action(Actions.FETCH_ATTACHED_ARTICLES, { namespace })
], KbArticles.prototype, "FetchAttachedActions", void 0);
__decorate([
    Getter(Getters.IS_ARTICLE_PREVIEW_LOADING, { namespace })
], KbArticles.prototype, "IsArticlePreviewLoading", void 0);
__decorate([
    Getter(Getters.IS_RELATED_ARTICLES_LOADING, { namespace })
], KbArticles.prototype, "IsRelatedArticlesLoading", void 0);
__decorate([
    Getter(Getters.IS_ARTICLE_ATTACHING, { namespace })
], KbArticles.prototype, "IsArticleAttaching", void 0);
__decorate([
    Getter(articleGetters.DICTIONARIES, { namespace: articleNamespace })
], KbArticles.prototype, "Dictionaries", void 0);
KbArticles = __decorate([
    Component
], KbArticles);
export default KbArticles;
//# sourceMappingURL=KbArticles.js.map