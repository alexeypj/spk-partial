import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import Tree from "../Tree/tree.vue";
import { Getter, Action } from "vuex-class";
import { Actions, Getters, namespace } from "../../../Store/Modules/Vulnerabilities/constants";
import { IJSTreeItem, IFile, IUser } from "../../../Store/Modules/Common/types";
import FileService from "../../../Shared/fileService";
import { Getters as commonGetters, namespace as commonNamespace, Actions as commonActions, noFilePreview } from "../../../Store/Modules/Common/constants";
import { Getters as userGetters, namespace as userNamespace, Actions as userActions } from "../../../Store/Modules/Users/constants";
import { formatDate } from "../../../Shared/utils";
import {
    IVulnerability,
    IVulnerabilityFolder,
    StatusDictionary,
    IVulnerabilityComment
} from "../../../Store/Modules/Vulnerabilities/types";
import range from "lodash/range";
import pdfjs from "pdfjs-dist/build/pdf";
import { urlHelper } from "../../../Shared/utils";
import { IUserFilter } from "../../../Store/Modules/Users/types";

@Component({
    components: {
        select2,
        Modal,
        Tree
    },
    mixins: [FileService]
})
export default class extends Vue {

    @Prop()
    public readonly Model: IVulnerability;

    @Getter(Getters.FOLDERS, { namespace })
    public readonly Folders: IVulnerabilityFolder[];

    @Getter(Getters.IS_VULNERABILITY_LOADING, { namespace })
    public readonly IsLoading: boolean;

    @Getter(commonGetters.IS_FILE_LIST_LOADING, { namespace: commonNamespace })
    public readonly IsFileListLoading: boolean;

    @Getter(Getters.FOLDER_PATH, { namespace })
    public readonly GetFolderPath: (folderId: number) => Array<[number, string]>;

    @Action(commonActions.FETCH_FILE_LIST, { namespace: commonNamespace })
    public FetchFiles: ({id, type}: {id: number, type: string}) => Promise<IFile[]>;

    @Action(commonActions.FETCH_FILE_INFO, { namespace: commonNamespace })
    public FetchFileInfo: (id: number) => Promise<IFile>;

    @Action(Actions.FETCH_COMMENTS, { namespace })
    public FetchComments: (id: number) => Promise<IVulnerabilityComment[]>;

    @Action(Actions.STORE_COMMENT, { namespace })
    public StoreComment: ({ id, text}: {id: number, text: string}) => Promise<number>;

    @Action(Actions.SET_STATUS, { namespace })
    public SetStatus: ({ id, statusId}: {id: number, statusId: number}) => Promise<number>;

    @Getter(Getters.IS_STATUS_SAVING, { namespace })
    public readonly IsStatusSaving: boolean;

    @Action(userActions.FETCH_USER_LIST, { namespace: userNamespace })
    public FetchUsers: (filter: IUserFilter) => Promise<IUser[]>;

    @Getter(userGetters.USER_LIST, { namespace: userNamespace })
    public readonly Users: IUser[];

    @Getter(userGetters.USER_BY_ID, { namespace: userNamespace })
    public GetUserById: (id: string) => IUser|undefined;

    @Getter(Getters.ARE_COMMENTS_LOADING, { namespace })
    public CommentsLoading: boolean;

    @Getter(Getters.IS_COMMENT_SAVING, { namespace })
    public CommentSaving: boolean;

    @Watch("Model")
    public async onModelChange(newModel: IVulnerability) {
        // this.model = {... newModel};
        // this.comments = await this.FetchComments(this.model.Id);
        this.statusType = newModel.StatusType;
    }

    @Watch("statusType")
    public onStatusChange(newVal: number) {
        newVal = Number(newVal);
        if (this.model.StatusType !== newVal) {
            this.SetStatus({ id: this.model.Id, statusId: newVal})
                .then(() => this.model.StatusType = newVal);
        }
    }

    private imageContentTypes: string[] = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
    private percentLoaded: number = 0;
    private info: IFile;
    private showDownloadButton: boolean = false;
    private errorText: string = "";
    private comments: IVulnerabilityComment[] = [];
    private showCommentForm: boolean = false;
    private commentText: string = "";
    private statusType: number = 0;

    private model: IVulnerability = {
        Id: 0,
        IdFolder: 0,
        StatusType: 0,
    };

    public async mounted(): Promise<void> {
        this.model = { ... this.Model };
        this.statusType = this.model.StatusType;

        this.comments = await this.FetchComments(this.model.Id);
        if (this.Users.length === 0) {
            await this.FetchUsers(<IUserFilter> {});
        }

        pdfjs.GlobalWorkerOptions.workerSrc = "/js/pdfjs/pdf.worker.min.js";

        if (this.Model.OriginalFileId) {
            this.initFile(this.Model.OriginalFileId, "original-document");
        }

        if (this.Model.TranslationFileId) {
            this.initFile(this.Model.TranslationFileId, "translation-document");
        }
    }

    public cancel(): void {
        this.$router.push("/Vulnerabilities");
    }

    public get folderName(): string {
        const folders: IVulnerabilityFolder[] = [];
        if (this.model.IdFolder) {
            let folder = this.Folders.find(x => x.Id === this.model.IdFolder);
            if (folder) {
                folders.push(folder);

                while (folder && folder.IdParent) {
                    folder = this.Folders.find(x => x.Id === folder!.IdParent);
                    if (folder) {
                        folders.push(folder);
                    }
                }
            }
        }
        return folders.reverse().map(x => x.Title).join('&nbsp;<i class="fa fa-angle-right" aria-hidden="true"></i>&nbsp;');
    }

    public getDictionaryValues(dictionary: IDictionaryItem[], values: number[]): string {
        if (values) {
            return dictionary.filter(x => values.indexOf(Number(x.Key)) !== -1).map(x => x.Value).join(", ");
        }
        return "";
    }

    private get createDate(): string {
        if (this.Model.CreateDate) {
            return formatDate(this.Model.CreateDate);
        }
        return "";
    }

    private dateFormat(date: Date): string {
        return formatDate(date);
    }

    private get hasTranslation(): boolean {
        if (this.Model.TranslationFileId) {
            return this.Model.TranslationFileId !== 0;
        }
        return false;
    }

    private async openFolder(id: number): Promise<void> {
        this.$emit("openFolder", id);
    }

    private get Statuses(): IDictionaryItem[] {
        const result = Array<IDictionaryItem>();
        for (let i = 0; i < 4; i++) {
            result.push(<IDictionaryItem> { Key: i, Value: StatusDictionary[i] });
        }
        return result;
   }

    private initFile(id: number, targetId: string) {
        this.FetchFileInfo(id).then((file: IFile) => {
            this.info = file;
            this.showDownloadButton = true;
            if (this.hasPreview(file)) {
                this.loadDocument(id);
            } else {
                const target =  document.getElementById(targetId);
                if (!target) {
                    return;
                } else {
                    if (this.isImage(file.ContentType)) {
                        target.innerHTML = `<img src="${urlHelper("Download/?id=" + id, "Files")}"/>`;
                    } else {
                        target.innerHTML = noFilePreview;
                    }
                }
            }
        })
        .catch(error => {
            this.showDownloadButton = false;
            if (error.name === "MissingPDFException") {
                bootbox.alert("Файл не найден");
            }
        });
    }

    private isImage(contentType: string): boolean {
        if (this.imageContentTypes.indexOf(contentType) !== -1) {
            return true;
        }
        return false;
    }

    private hasPreview(file: IFile): boolean {
        if (file) {
            if (file.PreviewId || file.ContentType === "application/pdf") {
                return true;
            }
        }
        return false;
    }

    private async loadDocument(id: number): Promise<void> {
        try {
            this.percentLoaded = 0;
            const loadingTask = pdfjs.getDocument(urlHelper("Preview/?id=" + id, "Files"));
            loadingTask.onProgress = ({loaded, total}) => {
                this.percentLoaded = Math.round((loaded * 100) / total);
            };

            const target =  document.getElementById("pdf-document");
            if (!target) {
                return;
            }

            loadingTask.promise.then((pdf) => {
                this.showDownloadButton = true;
                const pagePromises = range(1, pdf.numPages + 1).map(num => pdf.getPage(num));
                Promise.all(pagePromises).then(pages => {
                    const scale = 1.5;
                    target.innerHTML = "";
                    const canvases = pages.forEach(page => {
                        const viewport = page.getViewport({ scale });

                        // Prepare canvas using PDF page dimensions
                        const canvas = document.createElement("canvas");
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context
                        const canvasContext = canvas.getContext("2d");
                        const renderContext = { canvasContext, viewport };
                        page.render(renderContext);
                        const wrapper = document.createElement("div");
                        wrapper.append(canvas);
                        target.appendChild(wrapper);
                    });
                });
            }).catch(error => {
                this.showDownloadButton = false;
                if (error.name === "MissingPDFException") {
                    bootbox.alert("Файл не найден");
                }
            });
        } catch (error) {
            this.showDownloadButton = false;
            console.error(error);
            bootbox.alert(error);
        }
    }

    private toggleCommentForm(): void {
        this.showCommentForm = !this.showCommentForm;
    }

    private storeComment(): void {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.StoreComment({ id: this.model.Id, text: this.commentText })
                    .then(() => {
                        this.commentText = "";
                        this.errorText = "";
                        this.showCommentForm = false;
                        this.$validator.reset();
                        this.FetchComments(this.model.Id)
                            .then((comments) => this.comments = comments);
                })
                .catch(error => this.errorText = error);
            }
        });
    }

    private GetUserName(userId: string): string {
        const user = this.GetUserById(userId);
        if (user) {
            return user.FIO;
        }
        return "";
    }
}
