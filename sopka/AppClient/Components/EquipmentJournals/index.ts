import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/EquipmentJournals/constants";
import {
    IEquipmentJournalState, IEquipmentJournalDictionaries, IEquipmentJournalFilter, IEquipmentJournalItem, createFilter
} from "../../Store/Modules/EquipmentJournals/types";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import JournalFilter from "./Filter/JournalFilter.vue";
import { formatDate, logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
import { IColumnOptions, IFilterOptions } from "../../Shared/Datatable/types";

@Component({
    components: {
        JournalFilter,
        Datatable
    }
})
export default class EquipmentJournals extends Vue {

    @Prop()
    public readonly EquipmentId: number | undefined;

    @Action(Actions.FETCH_DICTIONARIES, { namespace: namespace})
    FetchDictionaries: () => Promise<IEquipmentJournalDictionaries>;

    @Action(Actions.FETCH_LIST, {namespace: namespace})
    FetchJournal: (filter: IEquipmentJournalFilter) => Promise<IEquipmentJournalItem[]>;

    @Getter(Getters.JOURNAL_LIST, {namespace: namespace})
    Journal: IEquipmentJournalItem[];

    @Getter(Getters.JOURNAL_LIST_TOTAL, {namespace: namespace})
    TotalItems: number;

    @Getter(Getters.CURRENT_FILTER, {namespace: namespace})
    Filter: IEquipmentJournalFilter;

    @Mutation(Mutations.SET_FILTER, {namespace: namespace})
    SetFilter: (filter: IEquipmentJournalFilter) => void;

    SelectedLog: IEquipmentJournalItem | null = null;

    created() {
        if (this.EquipmentId) {
            let filter = { ...this.Filter };
            filter.EquipmentId = this.EquipmentId;
            this.SetFilter(filter);
        }
    }
    
    mounted() {
        this.FetchDictionaries();
        this.FetchJournal(this.Filter);
        this.$store.subscribeAction((action: any) => {
            if (action.type === namespace + "/" + Actions.FETCH_LIST) {
                this.SelectedLog = null;
            }
        });
        logAction(LogActions.EquipmentJournalIndex, EntityType.EquipmentJournal);
    }

    get loadedLogs(): IEquipmentJournalItem[] {
        return this.Journal.map(x => {
            return { ...x, DateFormatted: formatDate(x.Date, "DD.MM.YYYY HH:mm:ss") };
        });
    }

    applyFilter(filter: IEquipmentJournalFilter) {
        this.SetFilter(filter);
        this.FetchJournal(this.Filter);
    }

    selectLog(logId: number) {
        var index = this.Journal.findIndex(x => x.Id === logId);
        if (index >= 0) {
            this.SelectedLog = this.Journal[index];
        }
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№" },
        { Name: "Level", DisplayName: "Уровень", Sort: true, SortColumnName: "Level" },
        { Name: "DateFormatted", DisplayName: "Время", Sort: true, SortColumnName: "Date" },
        { Name: "EquipmentName", DisplayName: "Оборудование", Sort: true, SortColumnName: "EquipmentName" },
        { Name: "Source", DisplayName: "Источник", Sort: true, SortColumnName: "Source" }
    ];

}
