import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IArticle, IKnowledgeBaseDictionaries, IFolder, Article, IIncidentArticle } from "../../../Store/Modules/KnowledgeBase/types";
import { IDictionaryItem, IEquipment } from "../../../Store/Modules/Inventory/types";
import { volumeDict, networkAdaptersDict } from "../../../Store/Modules/Equipment/types";
import select2 from "../../../Shared/Select2/select2.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import Tree from "../Tree/tree.vue";
import { Getter, Action } from "vuex-class";
import { Actions, Getters, namespace } from "../../../Store/Modules/KnowledgeBase/constants";
import { IJSTreeItem, IFile, ISopkaSettings } from "../../../Store/Modules/Common/types";
import { IIncident } from "../../../Store/Modules/Incident/types";
import { Actions as incidentActions, namespace as incidentNamespace } from "../../../Store/Modules/Incident/constants";
import { namespace as equipmentNamespace, Actions as equipmentActions } from "../../../Store/Modules/Inventory/constants";
import FileService from "../../../Shared/fileService";
import { Getters as commonGetters, namespace as commonNamespace, Actions as commonActions } from "../../../Store/Modules/Common/constants";
import RelatedIncidents from "./RelatedIncidents/relatedIncidents.vue";

@Component({
    components: {
        select2,
        Modal,
        Tree,
        RelatedIncidents
    },
    mixins: [FileService]
})
export default class extends Vue {

    @Prop()
    public readonly Model: IArticle;

    @Prop()
    public readonly baseIncidentId: number|undefined;

    @Prop({ required: true })
    public readonly Dictionaries: IKnowledgeBaseDictionaries;

    @Getter(Getters.FOLDERS, { namespace })
    public readonly Folders: IFolder[];

    @Action(Actions.STORE_ARTICLE, { namespace })
    public StoreArticle: ({ model, removedFiles }:
        { model: IArticle, removedFiles: IFile[], importedFiles: IFile[] }) => Promise<IArticle>;

    @Action(Actions.REMOVE_ARTICLE, { namespace })
    public RemoveArticle: (id: number) => Promise<boolean>;

    @Getter(Getters.JSTREE_FOLDERS, { namespace })
    public readonly JSTree: IJSTreeItem[];

    @Getter(Getters.IS_LOADING, { namespace })
    public readonly IsLoading: boolean;

    @Action(incidentActions.FETCH_INCIDENT, { namespace: incidentNamespace })
    public FetchIncident: (id: number) => Promise<IIncident>;

    @Action(equipmentActions.FETCH_EQUIPMENT, { namespace: equipmentNamespace })
    public readonly FetchEquipment: (id: number) => Promise<IEquipment>;

    @Getter(commonGetters.IS_FILE_LIST_LOADING, { namespace: commonNamespace })
    public readonly IsFileListLoading: boolean;

    @Action(commonActions.FETCH_FILE_LIST, { namespace: commonNamespace })
    public FetchFiles: ({id, type}: {id: number, type: string}) => Promise<IFile[]>;

    @Action(Actions.FETCH_ATTACHED_INCIDENTS, { namespace })
    public FetchAttachedIncidents: (id: number) => Promise<IIncidentArticle[]>;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Getter(commonGetters.SETTINGS, { namespace: commonNamespace })
    public readonly Settings: ISopkaSettings;

    @Watch("Model")
    public onModelChange(newModel: IArticle): void {
        this.model = {... newModel};
        if (this.model.Id) {
            this.setReadonly(true);
        } else {
            this.setReadonly(false);
            this.$nextTick(() => this.init());
        }
        this.$validator.reset();
    }

    private isSaved: boolean = false;
    private errorText: string = "";

    private readonly: boolean = true;
    private showFolderForm: boolean = false;

    private selectedFolder: string|null = null;

    private model: IArticle = new Article();
    private selectedFiles: File[] = [];
    private removedFiles: IFile[] = [];
    private existingFiles: IFile[] = [];
    /** Импортируемые из инцидента файлы */
    private importedFiles: IFile[] = [];
    private relatedIncidents: IIncidentArticle[] = [];
    private showRelatedIncidentsModal: boolean = false;

    public async mounted(): Promise<void> {
        this.model = { ... this.Model };
        if (this.model.Id) {
            this.existingFiles = await this.FetchFiles({id: this.model.Id, type: "article"});
        }

        if (this.baseIncidentId && this.model.Id === 0) {
            await this.preloadModel(Number(this.baseIncidentId));
        }

        if (this.Model.Id === 0) {
            this.setReadonly(false);
        }
        this.$nextTick(() => this.init());
    }

    private init(): void {
        if (this.readonly) {
            this.selectedFolder = this.model.IdFolder.toString();
        } else {
            $(".summernote").summernote({
                lang: "ru-RU",
                height: 200,
                minHeight: 100,
                maxHeight: 450
            }).ready(() => {
                $("#description").summernote("code", this.model.Description || "");
                $("#solution").summernote("code", this.model.Solution || "");
                this.selectedFolder = this.model.IdFolder.toString();
            });
        }
    }

    private async preloadModel(baseIncidentId: number): Promise<void> {
        const basedIncident = await this.FetchIncident(baseIncidentId);
        this.model.BaseIncidentId = baseIncidentId;
        this.model.Description = basedIncident.Description;

        const solution: string[] = [];
        if (basedIncident.BlockingRecommendations) {
            solution.push(basedIncident.BlockingRecommendations);
        }
        if (basedIncident.MitigationRecommendations) {
            solution.push(basedIncident.MitigationRecommendations);
        }
        if (basedIncident.PreventionRecommendations) {
            solution.push(basedIncident.PreventionRecommendations);
        }
        this.model.Solution = solution.join("<br />");

        if (basedIncident.AttackType) {
            this.model.AttackTypeTags = [basedIncident.AttackType];
        }

        if (basedIncident.SourceEquipmentId) {
            const equipment = await this.FetchEquipment(basedIncident.SourceEquipmentId);

            if (equipment) {
                const device = equipment.Devices[0];
                this.model.EquipmentTypeTags = [equipment.Type];
                this.model.PlatformTags = [equipment.Platform];
                this.model.MemoryTags = device.Memory.map(x => x.IdRAMDirectory);
                if (device.IdCPU) {
                    this.model.CPUTags = [device.IdCPU];
                }
                this.model.RaidTags = device.HDD.map(x => x.IdRAIDDirectory);
                this.model.HddTags = device.HDD.map(x => x.IdHDDDirectory);
                this.model.NetworkAdapterTags = device.NetworkAdapters.map(x => x.IdNetworkAdapterDirectory);
                this.model.SoftwareTags = device.Software.map(x => x.IdSoftDirectory);
                this.model.OSTags = device.OperationSystems.map(x => x.IdOSDirectory);
            }
        }
        this.importedFiles = await this.FetchFiles({id: baseIncidentId, type: "incident"});
    }

    public async store(): Promise<void> {
        this.model.Files = this.selectedFiles;

        const description: any =  $("#description").summernote("code");
        this.model.Description = description;

        const solution: any = $("#solution").summernote("code");
        this.model.Solution = solution;

        this.$validator.validateAll()
            .then(isValid => {
                if (isValid) {
                    this.StoreArticle({
                            model: this.model,
                            removedFiles: this.removedFiles,
                            importedFiles: this.importedFiles
                        })
                        .then((result) => {
                            this.isSaved = true;
                            setTimeout(() => this.isSaved = false, 5000);
                            this.$emit("stored", result.Id);
                            this.model = result;
                            this.selectedFiles = [];
                            this.FetchFiles({id: this.model.Id || 0, type: "article"})
                                .then((files => this.existingFiles = files));
                            this.removedFiles = [];
                            const fileInput = document.getElementById("fileSelector");
                            if (fileInput) {
                                (fileInput as HTMLInputElement).value = "";
                            }
                            this.setReadonly(true);
                            return result;
                    }).catch ((error) => {
                        this.errorText = error;
                    });
                }
            });
    }

    public cancel(): void {
        if (this.readonly || this.isNewArticle) {
            this.$router.push("/KnowledgeBase");
        }
        this.setReadonly(true);
    }

    private get isNewArticle(): boolean {
        return this.model && this.model.Id === 0;
    }

    public selectFolder(): void {
        this.showFolderForm = true;
    }

    public closeFolderForm(): void {
        this.showFolderForm = false;
    }

    public setFolder(): void {
        if (this.selectedFolder) {
            this.model.IdFolder = Number(this.selectedFolder);
        }
        this.closeFolderForm();
    }

    public get folderName(): string {
        const folders: IFolder[] = [];
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

    public get memoryDict(): IDictionaryItem[] {
        return volumeDict(this.Dictionaries.Memory);
    }

    public get networkAdaptersDict(): IDictionaryItem[] {
        return networkAdaptersDict(this.Dictionaries.NetworkAdapters);
    }

    public get hddDict(): IDictionaryItem[] {
        return volumeDict(this.Dictionaries.HDD);
    }

    public beforeDestroy(): void {
        $(".summernote").summernote("destroy");
    }

    public unlock(): void {
        this.setReadonly(false);
        this.$nextTick(() => this.init());
    }

    private setReadonly(value: boolean): void {
        if (value) {
            $("#description").summernote("destroy");
            $("#solution").summernote("destroy");
        }
        this.readonly = value;
    }

    public getDictionaryValues(dictionary: IDictionaryItem[], values: number[]): string {
        if (values) {
            return dictionary.filter(x => values.indexOf(Number(x.Key)) !== -1).map(x => x.Value).join(", ");
        }
        return "";
    }

    public removeFromImportedFiles(idx: number): void {
        this.importedFiles.splice(idx, 1);
    }

    public async showRelatedIncidents(): Promise<void> {
        if (this.model.Id) {
            this.showRelatedIncidentsModal = true;
            this.relatedIncidents = await this.FetchAttachedIncidents(this.model.Id);
        }
    }

    private closeRelatedIncidents(): void {
        this.showRelatedIncidentsModal = false;
    }

    private get maxUploadFileSize(): string {
        return this.Settings.MaxFileSize.toString();
    }

    private remove(): void {
        bootbox.confirm({ message: `Вы уверены что хотите удалить <strong>${this.model.Title}</strong>?`,
            animate: false,
            className: "bootbox-remove",
            buttons: {
                confirm: {
                    label: "Удалить",
                    className: "btn-danger"
                },
                cancel: {
                    label: "Отмена",
                    className: "btn-white"
                }
            },
            callback: (result: boolean) => {
                if (result && this.model.Id) {
                    this.RemoveArticle(this.model.Id)
                        .then((success: boolean) => {
                            if (success) {
                                this.$emit("refreshList", this.model.IdFolder);
                            }
                        })
                        .catch((error) => this.errorText = error);
                }
            }
        });
    }
}
