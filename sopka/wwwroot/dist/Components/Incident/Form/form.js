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
import { formatDate as _formatDate } from "../../../Shared/utils";
import { namespace, Getters, Actions } from "../../../Store/Modules/Incident/constants";
import DatePick from "vue-date-pick";
import Modal from "../../../Shared/Modals/modal.vue";
import moment from "moment";
import select2 from "../../../Shared/Select2/select2.vue";
import History from "./History/history.vue";
import { Actions as userActions, namespace as userNamespace, Getters as userGetters } from "../../../Store/Modules/Users/constants";
import { Getters as commonGetters, namespace as commonNamespace, Actions as commonActions } from "../../../Store/Modules/Common/constants";
import FileService from "../../../Shared/fileService";
import KbArticles from "./KbArticles/KbArticles.vue";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.targetStatus = {
            Name: "",
            Id: 0,
            Responsible: "",
            ResponsibleRole: { RoleId: "", UserId: "", ShortTitle: "" }
        };
        this.statusButtonContent = "";
        this.statusComment = "";
        this.model = {
            Id: 0,
            RelatedIncidents: []
        };
        this.showChangeStatusModel = false;
        this.errorText = "";
        this.isSaved = false;
        this.history = [];
        this.selectedFiles = [];
        this.removedFiles = [];
        this.existingFiles = [];
        this.showPopupAuto = true;
        this.showPopup = false;
    }
    cancelChangingStatus() {
        this.statusComment = "";
        this.showChangeStatusModel = false;
    }
    mounted() {
        this.model = Object.assign({}, this.Model);
        if (this.model.RelatedIncidents) {
            const related = this.model.RelatedIncidents;
            this.model.RelatedIncidents = related.map((x) => x.RelatedIncidentId);
        }
        if (this.model.FixationTime) {
            this.model.FixationTime = moment(this.model.FixationTime).format("YYYY-MM-DD HH:mm:ss");
        }
        if (this.model.DecisionTime) {
            this.model.DecisionTime = moment(this.model.DecisionTime).format("YYYY-MM-DD HH:mm:ss");
        }
        this.FetchHistory(this.model.Id)
            .then((result) => this.history = result)
            .catch(error => this.errorText = error);
        this.FetchFiles({ id: this.model.Id, type: "incident" })
            .then((result) => {
            this.existingFiles = result;
        })
            .catch(error => this.errorText = error);
        if (!this.Users || this.Users.length === 0) {
            this.FetchUsers({
                Page: 1,
                ItemsPerPage: 200
            });
        }
    }
    formatDate(date) {
        return _formatDate(date);
    }
    get canChangeStatus() {
        if (this.Model.Status) {
            if (this.Model.Status.Responsible) {
                if (this.CurrentUserHasRole(this.Model.Status.Responsible)) {
                    return true;
                }
            }
        }
        return false;
    }
    getStatusBtnClass(statusId) {
        const targetStatus = this.GetStatus(statusId);
        if (targetStatus) {
            switch (targetStatus.StatusType) {
                case 0: return "btn-default";
                case 1: return "btn-primary";
                case 2: return "btn-success";
                case 3: return "btn-warning";
            }
        }
        return "";
    }
    setStatus(statusId) {
        if (this.hasChanges()) {
            bootbox.alert("В карточке есть несохраненные изменения. Сохраните изменения перед сменой статуса.");
            return;
        }
        const targetStatus = this.GetStatus(statusId);
        if (targetStatus) {
            if (this.model.Status && this.model.Status.Transitions) {
                const transition = this.model.Status.Transitions.find(x => x.FinalStatusId === statusId);
                if (transition) {
                    this.statusButtonContent = transition.ButtonContent;
                }
            }
            this.targetStatus = targetStatus;
            this.statusComment = "";
            this.showChangeStatusModel = true;
        }
    }
    storeStatus() {
        this.SetStatusImp({ incidentId: this.model.Id, statusId: this.targetStatus.Id, comment: this.statusComment })
            .then(() => {
            this.showChangeStatusModel = false;
            this.$emit("statusSet");
            this.FetchHistory(this.model.Id).then((h) => this.history = h);
        })
            .catch((error) => this.errorText = error);
    }
    store() {
        this.model.Files = this.selectedFiles;
        this.$validator.validateAll().then((isValid) => {
            if (isValid) {
                this.SaveIncident({ incident: this.model, removedFiles: this.removedFiles })
                    .then((result) => {
                    if (typeof result === "number") {
                        this.isSaved = true;
                        setTimeout(() => this.isSaved = false, 5000);
                        this.$emit("saved");
                        this.FetchHistory(result).then((h) => this.history = h);
                    }
                    else {
                        this.errorText = result;
                    }
                })
                    .catch((error) => this.errorText = error);
            }
        });
    }
    openEquipment() {
        this.$router.push({ path: "/Equipment/" + (this.model.SourceEquipmentId.toString() || "0") });
    }
    openObject() {
        if (this.model.SourceEquipmentId) {
            const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
            if (equipment) {
                this.$router.push({ path: "/Inventory/" + (equipment.IdObject) });
            }
        }
    }
    getFio(user) {
        if (user) {
            return user.FIO;
        }
        return "";
    }
    get selectedRelatedIncidents() {
        if (this.RelatedIncidentsDict) {
            return this.model.RelatedIncidents.map((x) => {
                return this.RelatedIncidentsDict.find(r => r.Key === x.RelatedIncidentId);
            });
        }
    }
    setRelatedIncident(items) {
        this.model.RelatedIncidents = items.map(x => Number(x));
    }
    get equipmentIp() {
        if (this.model.SourceEquipmentId) {
            this.model.SourceEquipmentId = Number(this.model.SourceEquipmentId);
            const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
            if (equipment) {
                return equipment.IP;
            }
        }
        return "";
    }
    get equipmentDict() {
        return this.Dictionaries.Equipments.map(x => ({ Key: x.Id, Value: x.Name }));
    }
    get RelatedIncidents() {
        return this.Dictionaries.Incidents.map(x => ({
            Key: x.Id,
            Value: `${x.AttackTypeName} (${_formatDate(x.FixationTime)})`
        }));
    }
    cancel() {
        this.$emit("cancel");
    }
    /** Отображает окошко с подходящими статьями */
    showRelatedArticles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.model.SourceEquipmentId) {
                this.showPopup = true;
            }
        });
    }
    /** Ставит таймер на 2 секуды, после чего отображает подходящие статьи, если фокус не ушел из поля */
    setPopupTimer() {
        if (this.showPopupAuto && !this.popupHandler) {
            this.popupHandler = setTimeout(this.showRelatedArticles, 2000);
        }
    }
    /** Очищает таймер */
    clearPopupTimer() {
        if (this.popupHandler) {
            clearTimeout(this.popupHandler);
            this.popupHandler = null;
        }
    }
    closePopup() {
        this.showPopup = false;
        this.showPopupAuto = false;
    }
    addToKnowledgeBase() {
        this.$router.push({ path: "/KnowledgeBase/0", query: { incidentId: this.model.Id.toString() } });
    }
    getObjectName() {
        if (this.model.SourceEquipmentId) {
            const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
            if (equipment) {
                const object = this.FilterDictionaries.Objects.find(x => x.Key === equipment.IdObject);
                if (object) {
                    return object.Value;
                }
            }
        }
        return "";
    }
    getObjectAddress() {
        if (this.model.SourceEquipmentId) {
            const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
            if (equipment) {
                const object = this.FilterDictionaries.Objects.find(x => x.Key === equipment.IdObject);
                if (object) {
                    return object.Data || "";
                }
            }
        }
        return "";
    }
    hasChanges() {
        const checkedFields = ["Id", "Title", "AttackType", "Description", "DetectionMethod", "SourceIP",
            "SourceURL", "SourceCountry", "SourceAddress", "SourceEquipmentId", "IdStatus", "BlockingRecommendations",
            "MitigationRecommendations", "PreventionRecommendations"];
        for (const field of checkedFields) {
            if (this.model[field] !== this.Model[field]) {
                return true;
            }
        }
        if (moment(this.model.FixationTime).utc().isSame(moment(this.Model.FixationTime).utc()) === false) {
            return true;
        }
        if (this.model.DecisionTime != null || this.Model.DecisionTime != null) {
            if (typeof (this.model.DecisionTime) !== typeof (this.Model.DecisionTime)) {
                return true;
            }
            if (moment(this.model.DecisionTime).utc().isSame(moment(this.Model.DecisionTime).utc()) === false) {
                return true;
            }
        }
        if (this.model.RelatedIncidents.length !== this.Model.RelatedIncidents.length) {
            return true;
        }
        else {
            const relatedIncidents = this.Model.RelatedIncidents; // массив не number[]
            const except = this.model.RelatedIncidents.filter(x => relatedIncidents.find(i => i.RelatedIncidentId === x) === undefined);
            if (except.length > 0) {
                return true;
            }
        }
        return false;
    }
    get isIncidentClosed() {
        if (this.model && this.model.Status) {
            return this.model.Status.Name === "Закрыто";
        }
        return false;
    }
    get isFormDisabled() {
        return this.IsIncidentLoading || this.IsIncidentSaving;
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "Model", void 0);
__decorate([
    Prop({ required: true })
], default_1.prototype, "RelatedIncidentsDict", void 0);
__decorate([
    Prop()
], default_1.prototype, "EquipmentIp", void 0);
__decorate([
    Action(Actions.SET_STATUS, { namespace })
], default_1.prototype, "SetStatusImp", void 0);
__decorate([
    Action(Actions.SAVE_INCIDENT, { namespace })
], default_1.prototype, "SaveIncident", void 0);
__decorate([
    Action(Actions.FETCH_HISTORY, { namespace })
], default_1.prototype, "FetchHistory", void 0);
__decorate([
    Action(userActions.FETCH_USER_LIST, { namespace: userNamespace })
], default_1.prototype, "FetchUsers", void 0);
__decorate([
    Getter(userGetters.USER_LIST, { namespace: userNamespace })
], default_1.prototype, "Users", void 0);
__decorate([
    Getter(Getters.GET_DICTIONARIES_FOR_CREATION, { namespace })
], default_1.prototype, "Dictionaries", void 0);
__decorate([
    Getter(Getters.GET_DICTIONARIES_FOR_FILTER, { namespace })
], default_1.prototype, "FilterDictionaries", void 0);
__decorate([
    Getter(Getters.GET_STATUS, { namespace })
], default_1.prototype, "GetStatus", void 0);
__decorate([
    Getter(Getters.STATUSES, { namespace })
], default_1.prototype, "Statuses", void 0);
__decorate([
    Getter(Getters.IS_LOADING, { namespace })
], default_1.prototype, "IsLoading", void 0);
__decorate([
    Getter(commonGetters.HAS_ROLE, { namespace: commonNamespace })
], default_1.prototype, "CurrentUserHasRole", void 0);
__decorate([
    Getter(commonGetters.IS_FILE_LIST_LOADING, { namespace: commonNamespace })
], default_1.prototype, "IsFileListLoading", void 0);
__decorate([
    Action(commonActions.FETCH_FILE_LIST, { namespace: commonNamespace })
], default_1.prototype, "FetchFiles", void 0);
__decorate([
    Getter(Getters.IS_INCIDENT_SAVING, { namespace })
], default_1.prototype, "IsIncidentSaving", void 0);
__decorate([
    Getter(Getters.IS_INCIDENT_LOADING, { namespace })
], default_1.prototype, "IsIncidentLoading", void 0);
default_1 = __decorate([
    Component({
        components: {
            DatePick,
            Modal,
            select2,
            History,
            KbArticles
        },
        mixins: [FileService]
    })
], default_1);
export default default_1;
//# sourceMappingURL=form.js.map