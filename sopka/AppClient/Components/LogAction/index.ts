import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import { IColumnOptions, IFilterOptions } from "../../Shared/Datatable/types";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/LogAction/constants";
import { ILogActionDictionaries, ILogActionFilter, ILogActionState, ILogAction, GetDefaultFilter } from "../../Store/Modules/LogAction/types";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";
import LogActionFilter from "./Filter/LogActionFilter.vue";
import { formatDate } from "../../Shared/utils";
import LogDetails from "./Details/LogDetails.vue"
import Modal from "../../Shared/Modals/modal.vue";
import LogDetailsCell from "./TableCellComponents/logDetailsCell.vue";
import LogEntityCell from "./TableCellComponents/logEntityCell.vue";

@Component({
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

export default class LogAction extends Vue {

    @Getter(Getters.FILTER, {namespace: namespace})
    public Filter: ILogActionFilter;

    @Getter(Getters.LOGS, {namespace: namespace})
    public Logs: ILogAction[];

    @Getter(Getters.LOGS_TOTAL_COUNT, {namespace: namespace})
    public TotalItems: number;

    @Getter(Getters.GET_SELECTED_LOG, {namespace: namespace})
    public SelectedLog: ILogAction | null;

    @Getter(Getters.DICTIONARIES, {namespace: namespace})
    public Dictionaries: ILogActionDictionaries;

    @Mutation(Mutations.SET_FILTER, { namespace })
    public SetFilter: (filter: ILogActionFilter) => void;

    @Action(Actions.LOAD_DICTIONARIES, {namespace })
    public LoadDictionaries: () => Promise<any>;

    @Action(Actions.LOAD_LOGS, {namespace })
    public LoadLogs: (filter: ILogActionFilter) => Promise<any>;

    @Mutation(Mutations.SET_SELECTED_LOG, {namespace})
    public SetSelectedLog: (log: ILogAction | null) => void;

    public applyFilter(filter: ILogActionFilter): void {
        this.SetFilter(filter);
        this.LoadLogs(filter);
    }

    public mounted(): void {
        this.LoadDictionaries();
        this.LoadLogs(this.Filter);
    }

    get loadedLogs(): ILogAction[] {
        return this.Logs.map(x => {
            return { ...x, DateFormated: formatDate(x.Date, "DD.MM.YYYY HH:mm:ss") };
        });
    }

    closeLogDetails(): void {
        this.SetSelectedLog(null);
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "DateFormated", DisplayName: "Дата и время", Sort: true, SortColumnName: "Date" },
        { Name: "ActionTitle", DisplayName: "Действие", Sort: true, SortColumnName: "ActionTitle" },
        { Name: "ActionType", DisplayName: "Тип", Sort: true, SortColumnName: "ActionType" },
        { Name: "SessionId", DisplayName: "Сессия", Sort: true, SortColumnName: "SessionId" },
        { Name: "Entity", DisplayName: "Сущности", Sort: true, SortColumnName: "Entity", UseComponent: true, Component: LogEntityCell },
        { Name: "UserInfo", DisplayName: "Пользователь", Sort: true, SortColumnName: "UserInfo" },
        { Name: "LogDetails", DisplayName: "", UseComponent: true, Component: LogDetailsCell }
    ];

    get tableFilterOptions(): IFilterOptions[] {
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

}