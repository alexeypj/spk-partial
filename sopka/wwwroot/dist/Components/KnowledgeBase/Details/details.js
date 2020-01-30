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
import { Article } from "../../../Store/Modules/KnowledgeBase/types";
import { volumeDict, networkAdaptersDict } from "../../../Store/Modules/Equipment/types";
import select2 from "../../../Shared/Select2/select2.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import Tree from "../Tree/tree.vue";
import { Getter, Action } from "vuex-class";
import { Actions, Getters, namespace } from "../../../Store/Modules/KnowledgeBase/constants";
import { Actions as incidentActions, namespace as incidentNamespace } from "../../../Store/Modules/Incident/constants";
import { namespace as equipmentNamespace, Actions as equipmentActions } from "../../../Store/Modules/Inventory/constants";
import FileService from "../../../Shared/fileService";
import { Getters as commonGetters, namespace as commonNamespace, Actions as commonActions } from "../../../Store/Modules/Common/constants";
import RelatedIncidents from "./RelatedIncidents/relatedIncidents.vue";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.isSaved = false;
        this.errorText = "";
        this.readonly = true;
        this.showFolderForm = false;
        this.selectedFolder = null;
        this.model = new Article();
        this.selectedFiles = [];
        this.removedFiles = [];
        this.existingFiles = [];
        /** Импортируемые из инцидента файлы */
        this.importedFiles = [];
        this.relatedIncidents = [];
        this.showRelatedIncidentsModal = false;
    }
    onModelChange(newModel) {
        this.model = Object.assign({}, newModel);
        if (this.model.Id) {
            this.setReadonly(true);
        }
        else {
            this.setReadonly(false);
            this.$nextTick(() => this.init());
        }
        this.$validator.reset();
    }
    mounted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.model = Object.assign({}, this.Model);
            if (this.model.Id) {
                this.existingFiles = yield this.FetchFiles({ id: this.model.Id, type: "article" });
            }
            if (this.baseIncidentId && this.model.Id === 0) {
                yield this.preloadModel(Number(this.baseIncidentId));
            }
            if (this.Model.Id === 0) {
                this.setReadonly(false);
            }
            this.$nextTick(() => this.init());
        });
    }
    init() {
        if (this.readonly) {
            this.selectedFolder = this.model.IdFolder.toString();
        }
        else {
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
    preloadModel(baseIncidentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const basedIncident = yield this.FetchIncident(baseIncidentId);
            this.model.BaseIncidentId = baseIncidentId;
            this.model.Description = basedIncident.Description;
            const solution = [];
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
                const equipment = yield this.FetchEquipment(basedIncident.SourceEquipmentId);
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
            this.importedFiles = yield this.FetchFiles({ id: baseIncidentId, type: "incident" });
        });
    }
    store() {
        return __awaiter(this, void 0, void 0, function* () {
            this.model.Files = this.selectedFiles;
            const description = $("#description").summernote("code");
            this.model.Description = description;
            const solution = $("#solution").summernote("code");
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
                        this.FetchFiles({ id: this.model.Id || 0, type: "article" })
                            .then((files => this.existingFiles = files));
                        this.removedFiles = [];
                        const fileInput = document.getElementById("fileSelector");
                        if (fileInput) {
                            fileInput.value = "";
                        }
                        this.setReadonly(true);
                        return result;
                    }).catch((error) => this.errorText = error);
                }
            });
        });
    }
    cancel() {
        this.$router.push("/KnowledgeBase");
    }
    selectFolder() {
        this.showFolderForm = true;
    }
    closeFolderForm() {
        this.showFolderForm = false;
    }
    setFolder() {
        if (this.selectedFolder) {
            this.model.IdFolder = Number(this.selectedFolder);
        }
        this.closeFolderForm();
    }
    get folderName() {
        const folders = [];
        if (this.model.IdFolder) {
            let folder = this.Folders.find(x => x.Id === this.model.IdFolder);
            if (folder) {
                folders.push(folder);
                while (folder && folder.IdParent) {
                    folder = this.Folders.find(x => x.Id === folder.IdParent);
                    if (folder) {
                        folders.push(folder);
                    }
                }
            }
        }
        return folders.reverse().map(x => x.Title).join('&nbsp;<i class="fa fa-angle-right" aria-hidden="true"></i>&nbsp;');
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
    beforeDestroy() {
        $(".summernote").summernote("destroy");
    }
    unlock() {
        this.setReadonly(false);
        this.$nextTick(() => this.init());
    }
    setReadonly(value) {
        if (value) {
            $("#description").summernote("destroy");
            $("#solution").summernote("destroy");
        }
        this.readonly = value;
    }
    getDictionaryValues(dictionary, values) {
        if (values) {
            return dictionary.filter(x => values.indexOf(Number(x.Key)) !== -1).map(x => x.Value).join(", ");
        }
        return "";
    }
    removeFromImportedFiles(idx) {
        this.importedFiles.splice(idx, 1);
    }
    showRelatedIncidents() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.model.Id) {
                this.showRelatedIncidentsModal = true;
                this.relatedIncidents = yield this.FetchAttachedIncidents(this.model.Id);
            }
        });
    }
    closeRelatedIncidents() {
        this.showRelatedIncidentsModal = false;
    }
};
__decorate([
    Prop()
], default_1.prototype, "Model", void 0);
__decorate([
    Prop()
], default_1.prototype, "baseIncidentId", void 0);
__decorate([
    Prop({ required: true })
], default_1.prototype, "Dictionaries", void 0);
__decorate([
    Getter(Getters.FOLDERS, { namespace })
], default_1.prototype, "Folders", void 0);
__decorate([
    Action(Actions.STORE_ARTICLE, { namespace })
], default_1.prototype, "StoreArticle", void 0);
__decorate([
    Getter(Getters.JSTREE_FOLDERS, { namespace })
], default_1.prototype, "JSTree", void 0);
__decorate([
    Getter(Getters.IS_LOADING, { namespace })
], default_1.prototype, "IsLoading", void 0);
__decorate([
    Action(incidentActions.FETCH_INCIDENT, { namespace: incidentNamespace })
], default_1.prototype, "FetchIncident", void 0);
__decorate([
    Action(equipmentActions.FETCH_EQUIPMENT, { namespace: equipmentNamespace })
], default_1.prototype, "FetchEquipment", void 0);
__decorate([
    Getter(commonGetters.IS_FILE_LIST_LOADING, { namespace: commonNamespace })
], default_1.prototype, "IsFileListLoading", void 0);
__decorate([
    Action(commonActions.FETCH_FILE_LIST, { namespace: commonNamespace })
], default_1.prototype, "FetchFiles", void 0);
__decorate([
    Action(Actions.FETCH_ATTACHED_INCIDENTS, { namespace })
], default_1.prototype, "FetchAttachedIncidents", void 0);
__decorate([
    Watch("Model")
], default_1.prototype, "onModelChange", null);
default_1 = __decorate([
    Component({
        components: {
            select2,
            Modal,
            Tree,
            RelatedIncidents
        },
        mixins: [FileService]
    })
], default_1);
export default default_1;
//# sourceMappingURL=details.js.map