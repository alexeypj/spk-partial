var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import IncidentFilter from "./Filter/IncidentFilter.vue";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/Incident/constants";
import moment from "moment";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";
import Form from "./Form/form.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { formatDate, logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
import { Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
let IncidentCreation = class IncidentCreation extends Vue {
    constructor() {
        super(...arguments);
        this.showCreationForm = false;
        this.showEditForm = false;
        this.errorText = "";
        this.showFilters = true;
        this.model = {
            Id: 0,
            RelatedIncidents: [],
            FixationTime: moment().format("YYYY-MM-DD HH:mm:ss")
        };
        this.columns = [
            { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
            { Name: "Title", DisplayName: "Название", Sort: true, SortColumnName: "Title" },
            { Name: "AttackTypeName", DisplayName: "Тип атаки", Sort: true, SortColumnName: "AttackType" },
            { Name: "StatusName", DisplayName: "Статус", Sort: true, SortColumnName: "IdStatus" },
            { Name: "FixationTimeFormatted", DisplayName: "Дата фиксации", Sort: true, SortColumnName: "FixationTime" },
            { Name: "SourceIP", DisplayName: "IP источника", Sort: true, SortColumnName: "SourceIP" },
            { Name: "SourceCountry", DisplayName: "Страна источника", Sort: true, SortColumnName: "SourceCountry" }
        ];
    }
    onIdChange(newVal) {
        if (newVal) {
            if (Number(newVal) === 0) {
                this.displayCreationForm();
                logAction(LogActions.IncidentCreateForm);
            }
            else {
                this.openIncident(newVal);
                this.showFilters = false;
                logAction(LogActions.IncidentItem, EntityType.Incident, newVal.toString());
            }
        }
        else {
            logAction(LogActions.IncidentIndex);
            this.showCreationForm = false;
            this.showEditForm = false;
            this.showFilters = true;
        }
    }
    mounted() {
        this.FetchDictionaries();
        this.FetchFilterDictionaries();
        this.FetchStatuses();
        const filter = Object.assign({}, this.Filter);
        if (this.CurrentUser && this.CurrentUser.UserRoles && this.CurrentUser.UserRoles.length > 0) {
            filter.ResponsibleRoleId = this.CurrentUser.UserRoles[0].RoleId;
        }
        this.SetFilter(filter);
        this.FetchIncidents(filter);
        this.onIdChange(this.Id);
    }
    get loadedIncidents() {
        return this.Incidents.map(x => {
            return Object.assign({}, x, { FixationTimeFormatted: formatDate(x.FixationTime, "DD.MM.YYYY HH:mm:ss") });
        });
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
    get RelatedIncidents() {
        return this.Dictionaries.Incidents.map(x => ({
            Key: x.Id,
            Value: `${x.AttackTypeName} (${formatDate(x.FixationTime)})`
        }));
    }
    get equipmentDict() {
        return this.Dictionaries.Equipments.map(x => ({ Key: x.Id, Value: x.Name }));
    }
    get statusDictionaries() {
        return this.Statuses.map(x => ({ Key: x.Id, Value: x.Name }));
    }
    setRelatedIncident(items) {
        this.model.RelatedIncidents = items.map(x => Number(x));
    }
    applyFilter(filter) {
        this.SetFilter(filter);
        this.FetchIncidents(filter);
    }
    save() {
        this.$validator.validateAll().then((valid) => {
            if (valid) {
                this.SaveIncident({ incident: this.model, removedFiles: [] })
                    .then((result) => {
                    this.showCreationForm = false;
                    this.FetchIncidents(this.State.Filter);
                    this.$router.push({ path: "/Incident/" + result });
                });
            }
        });
    }
    cancel() {
        this.showCreationForm = false;
        this.showEditForm = false;
        this.model = {
            Id: 0,
            RelatedIncidents: [],
            FixationTime: moment().format("YYYY-MM-DD HH:mm:ss")
        };
        this.showFilters = true;
        this.$router.push({ path: "/Incident/" });
    }
    displayCreationForm() {
        this.$router.push({ path: "/Incident/0" });
        this.showCreationForm = true;
        this.closeFilters();
        this.showEditForm = false;
        this.model = {
            Id: 0,
            RelatedIncidents: [],
            FixationTime: moment().format("YYYY-MM-DD HH:mm:ss")
        };
    }
    openIncident(id) {
        this.showCreationForm = false;
        this.showEditForm = true;
        this.showFilters = false;
        this.FetchIncident(id)
            .then((result) => {
            this.model = Object.assign({}, result);
            this.$router.push({ path: "/Incident/" + id.toString() });
        })
            .catch((error) => this.errorText = error);
    }
    openFilters() {
        this.showFilters = true;
    }
    closeFilters() {
        this.showFilters = false;
    }
    isSelected(id) {
        return id === this.model.Id;
    }
    get showHideFiltersBtn() {
        return (this.showEditForm || this.showCreationForm) && this.showFilters;
    }
    getAttackType(id) {
        const attack = this.Dictionaries.Attacks.find(x => x.Key === id);
        if (attack) {
            return attack.Value;
        }
        return "";
    }
    dateFormat(date) {
        if (date) {
            return formatDate(date);
        }
        return "";
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
    openObject() {
        if (this.model.SourceEquipmentId) {
            const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
            if (equipment) {
                this.$router.push({ path: "/Inventory/" + (equipment.IdObject) });
            }
        }
    }
    get tableFilterOptions() {
        return [
            {
                ForColumn: "Id",
                FieldName: "Id",
                Placeholder: "Id",
                Type: "text",
                CSSClass: "col-sm-1",
                Value: this.Filter ? this.Filter.Id : undefined
            },
            {
                ForColumn: "Title",
                FieldName: "Title",
                Placeholder: "Название",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.Title : undefined
            },
            {
                ForColumn: "AttackTypeName",
                FieldName: "AttackType",
                Placeholder: "Тип компьютерной атаки",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.AttackType : undefined,
                SelectValues: this.Dictionaries.Attacks
            },
            {
                ForColumn: "StatusName",
                FieldName: "Status",
                Placeholder: "Статус",
                Type: "select",
                CSSClass: "col-sm-3",
                Value: this.Filter ? this.Filter.Status : undefined,
                SelectValues: this.statusDictionaries
            },
            {
                ForColumn: "FixationTimeFormatted",
                FieldName: "FixationTime",
                Placeholder: "Дата фиксации",
                Type: "date",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.FixationTime : undefined
            },
            {
                ForColumn: "SourceIP",
                FieldName: "SourceIP",
                Placeholder: "IP источника",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.SourceIP : undefined
            },
            {
                ForColumn: "SourceCountry",
                FieldName: "Country",
                Placeholder: "Страна источника",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.Country : undefined
            },
        ];
    }
};
__decorate([
    Prop()
], IncidentCreation.prototype, "Id", void 0);
__decorate([
    State(namespace)
], IncidentCreation.prototype, "State", void 0);
__decorate([
    Getter(Getters.GET_CURRENT_FILTER, { namespace })
], IncidentCreation.prototype, "Filter", void 0);
__decorate([
    Getter(Getters.GET_DICTIONARIES_FOR_CREATION, { namespace })
], IncidentCreation.prototype, "Dictionaries", void 0);
__decorate([
    Action(Actions.FETCH_DICTIONARIES_FOR_CREATION, { namespace })
], IncidentCreation.prototype, "FetchDictionaries", void 0);
__decorate([
    Action(Actions.FETCH_STATUSES, { namespace })
], IncidentCreation.prototype, "FetchStatuses", void 0);
__decorate([
    Getter(Getters.GET_DICTIONARIES_FOR_FILTER, { namespace })
], IncidentCreation.prototype, "FilterDictionaries", void 0);
__decorate([
    Getter(Getters.INCIDENTS, { namespace })
], IncidentCreation.prototype, "Incidents", void 0);
__decorate([
    Getter(Getters.INCIDENTS_TOTAL_ITEMS, { namespace })
], IncidentCreation.prototype, "TotalItems", void 0);
__decorate([
    Action(Actions.FETCH_DICTIONARIES_FOR_FILTER, { namespace })
], IncidentCreation.prototype, "FetchFilterDictionaries", void 0);
__decorate([
    Action(Actions.FETCH_INCIDENTS, { namespace })
], IncidentCreation.prototype, "FetchIncidents", void 0);
__decorate([
    Action(Actions.SAVE_INCIDENT, { namespace })
], IncidentCreation.prototype, "SaveIncident", void 0);
__decorate([
    Action(Actions.FETCH_INCIDENT, { namespace })
], IncidentCreation.prototype, "FetchIncident", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace })
], IncidentCreation.prototype, "SetFilter", void 0);
__decorate([
    Getter(Getters.STATUSES, { namespace })
], IncidentCreation.prototype, "Statuses", void 0);
__decorate([
    Getter(commonGetters.CURRENT_USER, { namespace: commonNamespace })
], IncidentCreation.prototype, "CurrentUser", void 0);
__decorate([
    Getter(Getters.IS_INCIDENT_SAVING, { namespace })
], IncidentCreation.prototype, "IsIncidentSaving", void 0);
__decorate([
    Watch("Id")
], IncidentCreation.prototype, "onIdChange", null);
IncidentCreation = __decorate([
    Component({
        components: {
            DatePick,
            IncidentFilter,
            Datatable,
            Form,
            select2
        }
    })
], IncidentCreation);
export default IncidentCreation;
//# sourceMappingURL=index.js.map