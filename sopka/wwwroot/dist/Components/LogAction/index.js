var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/LogAction/constants";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";
import LogActionFilter from "./Filter/LogActionFilter.vue";
import { formatDate } from "../../Shared/utils";
import LogDetails from "./Details/LogDetails.vue";
import Modal from "../../Shared/Modals/modal.vue";
import LogDetailsCell from "./TableCellComponents/logDetailsCell.vue";
import LogEntityCell from "./TableCellComponents/logEntityCell.vue";
let LogAction = class LogAction extends Vue {
    constructor() {
        super(...arguments);
        this.columns = [
            { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
            { Name: "DateFormated", DisplayName: "Дата и время", Sort: true, SortColumnName: "Date" },
            { Name: "ActionTitle", DisplayName: "Действие", Sort: true, SortColumnName: "ActionTitle" },
            { Name: "ActionType", DisplayName: "Тип действия", Sort: true, SortColumnName: "ActionType" },
            { Name: "SessionId", DisplayName: "Сессия", Sort: true, SortColumnName: "SessionId" },
            { Name: "Entity", DisplayName: "Сущности", Sort: true, SortColumnName: "Entity", UseComponent: true, Component: LogEntityCell },
            { Name: "UserInfo", DisplayName: "Пользователь", Sort: true, SortColumnName: "UserInfo" },
            { Name: "LogDetails", DisplayName: "Детали лога", UseComponent: true, Component: LogDetailsCell }
        ];
    }
    applyFilter(filter) {
        this.SetFilter(filter);
        this.LoadLogs(filter);
    }
    mounted() {
        this.LoadDictionaries();
        this.LoadLogs(this.Filter);
    }
    get loadedLogs() {
        return this.Logs.map(x => {
            return Object.assign({}, x, { DateFormated: formatDate(x.Date, "DD.MM.YYYY HH:mm:ss") });
        });
    }
    closeLogDetails() {
        this.SetSelectedLog(null);
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
                ForColumn: "DateFormated",
                FieldName: "Date",
                Placeholder: "Дата",
                Type: "date",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.Date : undefined
            },
            {
                ForColumn: "ActionTitle",
                FieldName: "ActionName",
                Placeholder: "Действие",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.ActionName || undefined : undefined,
                SelectValues: this.Dictionaries.Actions
            },
            {
                ForColumn: "ActionType",
                FieldName: "IsMainAction",
                Placeholder: "Тип действия",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.ActionType || undefined : undefined,
                SelectValues: this.Dictionaries.ActionTypes
            },
            {
                ForColumn: "SessionId",
                FieldName: "SessionId",
                Placeholder: "Сессия",
                Type: "text",
                CSSClass: "col-sm-1",
                Value: this.Filter ? this.Filter.SessionId || undefined : undefined,
            },
            {
                ForColumn: "Entity",
                FieldName: "EntityType",
                Placeholder: "Сущность",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.EntityType || undefined : undefined,
                SelectValues: this.Dictionaries.EntityTypes
            },
            {
                ForColumn: "UserInfo",
                FieldName: "UserId",
                Placeholder: "Пользователь",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.UserId || undefined : undefined,
                SelectValues: this.Dictionaries.Users
            },
            {
                ForColumn: "LogDetails",
                Type: "none",
                CSSClass: "",
                FieldName: "",
                Value: undefined
            }
        ];
    }
};
__decorate([
    Getter(Getters.FILTER, { namespace: namespace })
], LogAction.prototype, "Filter", void 0);
__decorate([
    Getter(Getters.LOGS, { namespace: namespace })
], LogAction.prototype, "Logs", void 0);
__decorate([
    Getter(Getters.LOGS_TOTAL_COUNT, { namespace: namespace })
], LogAction.prototype, "TotalItems", void 0);
__decorate([
    Getter(Getters.GET_SELECTED_LOG, { namespace: namespace })
], LogAction.prototype, "SelectedLog", void 0);
__decorate([
    Getter(Getters.DICTIONARIES, { namespace: namespace })
], LogAction.prototype, "Dictionaries", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace })
], LogAction.prototype, "SetFilter", void 0);
__decorate([
    Action(Actions.LOAD_DICTIONARIES, { namespace })
], LogAction.prototype, "LoadDictionaries", void 0);
__decorate([
    Action(Actions.LOAD_LOGS, { namespace })
], LogAction.prototype, "LoadLogs", void 0);
__decorate([
    Mutation(Mutations.SET_SELECTED_LOG, { namespace })
], LogAction.prototype, "SetSelectedLog", void 0);
LogAction = __decorate([
    Component({
        components: {
            DatePick,
            LogActionFilter,
            Datatable,
            Modal,
            LogDetails,
            LogDetailsCell,
            LogEntityCell
        }
    })
], LogAction);
export default LogAction;
//# sourceMappingURL=index.js.map