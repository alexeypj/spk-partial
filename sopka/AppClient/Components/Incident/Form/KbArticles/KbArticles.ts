import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { namespace, Getters, Actions } from "../../../../Store/Modules/Incident/constants";
import { IKnowledgeBaseIncidentMatch, TagsMap, IIncidentCreationDictionaries } from "../../../../Store/Modules/Incident/types";
import { IFile } from "../../../../Store/Modules/Common/types";
import {
    Getters as commonGetters,
    namespace as commonNamespace,
    Actions as commonActions
} from "../../../../Store/Modules/Common/constants";
import { urlHelper } from "../../../../Shared/utils";
import { IArticle, IKnowledgeBaseDictionaries, IIncidentArticle } from "../../../../Store/Modules/KnowledgeBase/types";
import { IDictionaryItem } from "../../../../Store/Modules/Inventory/types";
import {
    Getters as articleGetters,
    Actions as articleActions,
    namespace as articleNamespace,
} from "../../../../Store/Modules/KnowledgeBase/constants";

@Component
export default class KbArticles extends Vue {

    @Prop({ required: true })
    public readonly IncidentId: number;

    @Action(Actions.FETCH_RELATED_ARTICLES, { namespace })
    public FetchRelatedArticles:
                ({incidentId, excludeArticles}: {incidentId: number, excludeArticles: number[]}) => Promise<IKnowledgeBaseIncidentMatch[]>;

    @Action(Actions.FETCH_ARTICLE_PREVIEW, { namespace })
    public FetchArticlePreview: (articleId: number) => Promise<IArticle>;

    @Action(commonActions.FETCH_FILE_LIST, { namespace: commonNamespace })
    public FetchFiles: ({id, type}: {id: number, type: string}) => Promise<IFile[]>;

    @Action(Actions.ATTACH_ARTICLE_TO_INCIDENT, { namespace })
    public AttachArticle: ({ incidentId, articleId }: { incidentId: number, articleId: number}) => Promise<boolean>;

    @Action(Actions.DETACH_ARTICLE_FROM_INCIDENT, { namespace })
    public DetachArticle: ({ incidentId, articleId }: { incidentId: number, articleId: number}) => Promise<boolean>;

    @Action(articleActions.FETCH_DICTIONARIES, { namespace: articleNamespace })
    public FetchDictionaries: () => Promise<void>;

    @Action(Actions.FETCH_ATTACHED_ARTICLES, { namespace })
    public FetchAttachedActions: (id: number) => Promise<IIncidentArticle[]>;

    @Getter(Getters.IS_ARTICLE_PREVIEW_LOADING, { namespace })
    public IsArticlePreviewLoading: boolean;

    @Getter(Getters.IS_RELATED_ARTICLES_LOADING, { namespace })
    public IsRelatedArticlesLoading: boolean;

    @Getter(Getters.IS_ARTICLE_ATTACHING, { namespace })
    public readonly IsArticleAttaching: boolean;

    @Getter(articleGetters.DICTIONARIES, { namespace: articleNamespace})
    public readonly Dictionaries: IKnowledgeBaseDictionaries;

    private kbMatches: IKnowledgeBaseIncidentMatch[] = [];
    private articlePreview: IArticle|null = null;
    private articlePreviewFiles: IFile[] = [];
    private incidentArticles: IIncidentArticle[] = [];

    public mounted() {

        if (this.Dictionaries.AttackTypes.length === 0) {
            this.FetchDictionaries();
        }
        this.loadArticles();
        this.FetchAttachedActions(this.IncidentId)
            .then(result => this.incidentArticles = result);
    }

    private async loadArticles() {
        this.kbMatches = await this.FetchRelatedArticles({ incidentId: this.IncidentId, excludeArticles: this.getRemovedMatches()});
    }

    private getMatchList(tags: string[]): string {
        if (tags) {
            const tagNames: string[] = [];
            for (const tag of tags) {
                tagNames.push(TagsMap[tag]);
            }
            return tagNames.join(", ");
        }
        return "";
    }

    private getRemovedMatches(): number[] {
        const removedMatches = this.getMatchesFromStorage();
        if (removedMatches && removedMatches[this.IncidentId]) {
            return removedMatches[this.IncidentId];
        }
        return [];
    }

    private async removeMatchFromArticle(articleId: number): Promise<void> {
        const removedMatches = this.getMatchesFromStorage();
        if (removedMatches[this.IncidentId]) {
            const incidentMatches = removedMatches[this.IncidentId];
            if (incidentMatches.indexOf(articleId) === -1) {
                incidentMatches.push(articleId);
            }
        } else {
            removedMatches[this.IncidentId] = [articleId];
        }
        this.storeMatches(removedMatches);
        // this.showRelatedArticles();
        await this.loadArticles();
    }

    private async removeMatchesFromStorage(): Promise<void> {
        const removedMatches = this.getMatchesFromStorage();
        removedMatches[this.IncidentId] = [];
        this.storeMatches(removedMatches);
        // this.showRelatedArticles();
        await this.loadArticles();
    }

    private getMatchesFromStorage(): object {
        try {
            const matches = localStorage.getItem("INCIDENT_REMOVED_MATCHES");
            if (matches) {
                return JSON.parse(matches);
            }
            return {};
        } catch (error) {
            console.warn(error);
            localStorage.removeItem("INCIDENT_REMOVED_MATCHES");
            return {};
        }
    }

    private storeMatches(matches: object) {
        localStorage.setItem("INCIDENT_REMOVED_MATCHES", JSON.stringify(matches));
    }

    private get showArticlePreview(): boolean {
        return this.articlePreview !== null;
    }

    private async openArticleInfo(id: number) {
        const [article, files] = await Promise.all([this.FetchArticlePreview(id), this.FetchFiles({id, type: "article" })]);
        this.articlePreview = article;
        this.articlePreviewFiles = files;
    }

    private closePreview(): void {
        this.articlePreview = null;
        this.articlePreviewFiles = [];
    }

    public openFile(file: IFile): void {
        if (file) {
            window.open(urlHelper(`${file.Id}`, "FilePreview"));
        }
    }

    public async attachArticle(articleId: number): Promise<void> {
        if (this.articlePreview != null) {
            this.AttachArticle({ incidentId: this.IncidentId, articleId })
            .then(x => this.FetchAttachedActions(this.IncidentId)
            .then((result) => this.incidentArticles = result));
        }
    }

    public async detachArticle(articleId: number): Promise<void> {
        if (this.articlePreview != null) {
            this.DetachArticle({ incidentId: this.IncidentId, articleId })
            .then(x => this.FetchAttachedActions(this.IncidentId)
            .then((result) => this.incidentArticles = result));
        }
    }

    private getTags(): string {
        if (this.articlePreview) {
            const tags: string[] = [];
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

    private getDictionaryValues(dictionary: IDictionaryItem[], values?: number[]): string[] {
        if (dictionary && values) {
            const result: string[] = [];
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

    private isAttached(id: number): boolean {
        return this.incidentArticles.find(x => x.ArticleId === id) !== undefined;
    }

    private get isTextOverflow(): boolean {
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
}
