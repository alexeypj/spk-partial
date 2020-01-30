import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {
    IIncident,
    IIncidentCreationDictionaries,
    IIncidentStatus,
    IIncidentStatusHistory,
} from "../../../Store/Modules/Incident/types";
import { formatDate as _formatDate } from "../../../Shared/utils";
import { namespace, Getters, Actions } from "../../../Store/Modules/Incident/constants";
import DatePick from "vue-date-pick";
import Modal from "../../../Shared/Modals/modal.vue";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import { IUser, IFile } from "../../../Store/Modules/Common/types";
import moment from "moment";
import select2 from "../../../Shared/Select2/select2.vue";
import History from "./History/history.vue";
import { Actions as userActions, namespace as userNamespace, Getters as userGetters } from "../../../Store/Modules/Users/constants";
import { IUserFilter } from "../../../Store/Modules/Users/types";
import { Getters as commonGetters, namespace as commonNamespace, Actions as commonActions } from "../../../Store/Modules/Common/constants";
import FileService from "../../../Shared/fileService";
import KbArticles from "./KbArticles/KbArticles.vue";

@Component({
    components: {
        DatePick,
        Modal,
        select2,
        History,
        KbArticles
    },
    mixins: [FileService]
})
export default class extends Vue {

    @Prop({required: true})
    public readonly Model: IIncident;

    @Prop({ required: true })
    public readonly RelatedIncidentsDict: IDictionaryItem[];

    @Prop()
    public readonly EquipmentIp: string;

    @Action(Actions.SET_STATUS, { namespace })
    public SetStatusImp: ({ incidentId, statusId, comment }: { incidentId: number, statusId: number, comment: string }) => Promise<boolean>;

    @Action(Actions.SAVE_INCIDENT, { namespace })
    public SaveIncident: ({incident, removedFiles}: {incident: IIncident, removedFiles: IFile[]}) => Promise<any>;

    @Action(userActions.FETCH_USER_LIST, { namespace: userNamespace})
    public FetchUsers: (filter: IUserFilter) => Promise<IUser[]>;

    @Getter(userGetters.USER_LIST, { namespace: userNamespace })
    public Users: IUser[];

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public IsSuperAdminOrPaidAccess: boolean;

    /*** @TODO WTF? */
    @Getter(Getters.GET_DICTIONARIES_FOR_CREATION, { namespace })
    public readonly Dictionaries: IIncidentCreationDictionaries;

    @Getter(Getters.GET_DICTIONARIES_FOR_FILTER, { namespace})
    public readonly FilterDictionaries: IIncidentCreationDictionaries;

    @Getter(Getters.GET_STATUS, { namespace })
    public GetStatus: (id: number) => IIncidentStatus | undefined;

    @Getter(Getters.STATUSES, { namespace })
    public readonly Statuses: IIncidentStatus[];

    @Getter(Getters.IS_LOADING, { namespace })
    public readonly IsLoading: boolean;

    @Getter(commonGetters.HAS_ROLE, { namespace: commonNamespace})
    public CurrentUserHasRole: (roleId: string) => boolean;

    @Getter(commonGetters.IS_FILE_LIST_LOADING, { namespace: commonNamespace })
    public readonly IsFileListLoading: boolean;

    @Action(commonActions.FETCH_FILE_LIST, { namespace: commonNamespace })
    public FetchFiles: ({id, type}: {id: number, type: string}) => Promise<IFile[]>;

    @Getter(Getters.IS_INCIDENT_SAVING, { namespace })
    public readonly IsIncidentSaving: boolean;

    @Getter(Getters.IS_INCIDENT_LOADING, { namespace })
    public readonly IsIncidentLoading: boolean;

    private targetStatus: IIncidentStatus = {
        Name: "",
        Id: 0,
        Responsible: "",
        ResponsibleRole: { RoleId: "", UserId: "", ShortTitle: "" }
    };
    private statusButtonContent: string = "";
    private statusComment: string = "";

    private model: IIncident = {
        Id: 0,
        RelatedIncidents: []
    };

    private showChangeStatusModel: boolean = false;
    private errorText: string = "";
    private isSaved: boolean = false;
    private history: IIncidentStatusHistory[] = [];

    private selectedFiles: File[] = [];
    private removedFiles: IFile[] = [];
    private existingFiles: IFile[] = [];

    private showPopupAuto: boolean = true;
    private popupHandler: NodeJS.Timeout|null;
    private showPopup: boolean = false;
    private showAdditionalInfo = false;

    public cancelChangingStatus(): void {
        this.statusComment = "";
        this.showChangeStatusModel = false;

    }

    public mounted(): void {
        this.model = {...this.Model };
        if (this.model.RelatedIncidents) {
            const related = this.model.RelatedIncidents;
            this.model.RelatedIncidents = related.map((x: any) => x.RelatedIncidentId);
        }

        if (this.model.FixationTime) {
            this.model.FixationTime = moment(this.model.FixationTime).format("YYYY-MM-DD HH:mm:ss");
        }

        if (this.model.DecisionTime) {
            this.model.DecisionTime = moment(this.model.DecisionTime).format("YYYY-MM-DD HH:mm:ss");
        }

        this.FetchFiles({ id: this.model.Id, type: "incident"})
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

        this.initTextares();
    }

    public formatDate(date: Date): string {
        return _formatDate(date);
    }

    public get canChangeStatus(): boolean {
        if (this.Model.Status) {
            if (this.Model.Status.Responsible) {
                if (this.CurrentUserHasRole(this.Model.Status.Responsible)) {
                    return true;
                }
            }
        }
        return false;
    }

    public getStatusBtnClass(statusId: number): string {
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

    public setStatus(statusId: number): void {
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

    public storeStatus(): void {
        this.SetStatusImp({incidentId: this.model.Id, statusId: this.targetStatus.Id, comment: this.statusComment})
            .then(() => {
                this.showChangeStatusModel = false;
                this.$emit("statusSet");
                // this.FetchHistory(this.model.Id).then((h) => this.history = h);
            })
            .catch((error: string) => this.errorText = error);
    }

    public store() {
        this.model.Files = this.selectedFiles;
        this.$validator.validateAll().then((isValid) => {
            if (isValid) {
                this.SaveIncident({ incident: this.model, removedFiles: this.removedFiles})
                    .then((result: number | string) => {
                        if (typeof result === "number") {
                            this.isSaved = true;
                            setTimeout(() => this.isSaved = false, 5000);
                            this.$emit("saved");
                        } else {
                            this.errorText = result;
                        }
                    })
                    .catch((error: string) => this.errorText = error);
            }
        });
    }

    public openEquipment() {
        this.$router.push({ path: "/Equipment/" + (this.model.SourceEquipmentId!.toString() || "0") });
    }

    public openObject() {
        if (this.model.SourceEquipmentId) {
            const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
            if (equipment) {
                this.$router.push({ path: "/Inventory/" + (equipment.IdObject) });
            }
        }
    }

    public getFio(user: IUser): string {
        if (user) {
            return user.FIO;
        }
        return "";
    }

    public get selectedRelatedIncidents(): IDictionaryItem[] | undefined {
        if (this.RelatedIncidentsDict) {
            return this.model.RelatedIncidents.map((x: any) => {
                return <IDictionaryItem> this.RelatedIncidentsDict.find(r => r.Key === x.RelatedIncidentId);
            });
        }
    }

    public setRelatedIncident(items: string[]): void {
        this.model.RelatedIncidents = items.map(x => Number(x));
    }

    public get equipmentIp(): string {
        if (this.model.SourceEquipmentId) {
          this.model.SourceEquipmentId = Number(this.model.SourceEquipmentId);
          const equipment =  this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
          if (equipment) {
            return equipment.IP;
          }
        }
        return "";
    }

    public get equipmentName(): string {
        if (this.model.SourceEquipmentId) {
          this.model.SourceEquipmentId = Number(this.model.SourceEquipmentId);
          const equipment =  this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
          if (equipment) {
            return equipment.Name;
          }
        }
        return "";
    }

    public get equipmentDict(): IDictionaryItem[] {
        return this.Dictionaries.Equipments.map(x => <IDictionaryItem> { Key: x.Id, Value: x.Name });
    }

    get RelatedIncidents(): IDictionaryItem[] {
        return this.Dictionaries.Incidents.map(x => <IDictionaryItem> {
          Key: x.Id,
          Value: `${x.AttackTypeName} (${_formatDate(x.FixationTime)})`
        });
    }

    public cancel(): void {
        this.$emit("cancel");
    }

    private initTextares() {
        this.$nextTick(() => ($("#description") as any).resizeTextarea());
    }

    /** Отображает окошко с подходящими статьями */
    public async showRelatedArticles(): Promise<void> {
        if (this.model.SourceEquipmentId) {
            this.showPopup = true;
        }
    }

    /** Ставит таймер на 2 секуды, после чего отображает подходящие статьи, если фокус не ушел из поля */
    private setPopupTimer(): void {
        if (this.showPopupAuto && !this.popupHandler) {
            this.popupHandler = setTimeout(this.showRelatedArticles, 2000);
        }
    }

    /** Очищает таймер */
    private clearPopupTimer(): void {
        if (this.popupHandler) {
            clearTimeout(this.popupHandler);
            this.popupHandler = null;
        }
    }

    private closePopup(): void {
        this.showPopup = false;
        this.showPopupAuto = false;
    }

    private addToKnowledgeBase(): void {
        this.$router.push({ path: "/KnowledgeBase/0", query: { incidentId : this.model.Id.toString() }});
    }

    private getObjectName(): string {
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

    private getObjectAddress(): string {
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

    private hasChanges(): boolean {
        const checkedFields = ["Id", "Title", "AttackType", "Description", "DetectionMethod", "SourceIP",
            "SourceURL", "SourceCountry", "SourceAddress", "SourceEquipmentId", "IdStatus", "BlockingRecommendations",
            "MitigationRecommendations", "SeverityId", "PreventionRecommendations"];

        for (const field of checkedFields) {
            if (this.model[field] !== this.Model[field]) {
                console.warn("field", field, this.model[field], this.Model[field]);
                return true;
            }
        }
        if (moment(this.model.FixationTime).utc().isSame(moment(this.Model.FixationTime).utc()) === false) {
            return true;
        }

        if (this.model.DecisionTime != null || this.Model.DecisionTime != null) {
            if (typeof(this.model.DecisionTime) !== typeof(this.Model.DecisionTime)) {
                return true;
            }

            if (moment(this.model.DecisionTime).utc().isSame(moment(this.Model.DecisionTime).utc()) === false) {
                return true;
            }
        }

        if (this.model.RelatedIncidents.length !== this.Model.RelatedIncidents.length) {
            return true;
        } else {
            const relatedIncidents = this.Model.RelatedIncidents as any; // массив не number[]
            const except = this.model.RelatedIncidents.filter(x => relatedIncidents.find(i => i.RelatedIncidentId === x) === undefined);
            if (except.length > 0) {
                return true;
            }
        }
        return false;
    }

    private get isIncidentClosed(): boolean {
        if (this.model && this.model.Status) {
            return this.model.Status.Name === "Закрыт";
        }
        return false;
    }

    private get isFormDisabled(): boolean {
        return this.IsIncidentLoading || this.IsIncidentSaving || !this.IsSuperAdminOrPaidAccess;
    }
}
