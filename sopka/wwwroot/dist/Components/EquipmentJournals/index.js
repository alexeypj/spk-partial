var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/EquipmentJournals/constants";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import JournalFilter from "./Filter/JournalFilter.vue";
import { formatDate } from "../../Shared/utils";
let EquipmentJournals = class EquipmentJournals extends Vue {
    constructor() {
        super(...arguments);
        this.SelectedLog = null;
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Level", DisplayName: "Уровень", Sort: true, SortColumnName: "Level" },
            { Name: "DateFormatted", DisplayName: "Время", Sort: true, SortColumnName: "Date" },
            { Name: "EquipmentName", DisplayName: "Оборудование", Sort: true, SortColumnName: "EquipmentName" },
            { Name: "Source", DisplayName: "Источник", Sort: true, SortColumnName: "Source" }
        ];
    }
    mounted() {
        this.FetchDictionaries();
        this.FetchJournal(this.Filter);
        this.$store.subscribeAction((action) => {
            if (action.type === namespace + "/" + Actions.FETCH_LIST) {
                this.SelectedLog = null;
            }
        });
    }
    get loadedLogs() {
        return this.Journal.map(x => {
            return Object.assign({}, x, { DateFormatted: formatDate(x.Date, "DD.MM.YYYY HH:mm:ss") });
        });
    }
    applyFilter(filter) {
        this.SetFilter(filter);
        this.FetchJournal(this.Filter);
    }
    selectLog(logId) {
        var index = this.Journal.findIndex(x => x.Id === logId);
        if (index >= 0) {
            this.SelectedLog = this.Journal[index];
        }
    }
};
__decorate([
    Action(Actions.FETCH_DICTIONARIES, { namespace: namespace })
], EquipmentJournals.prototype, "FetchDictionaries", void 0);
__decorate([
    Action(Actions.FETCH_LIST, { namespace: namespace })
], EquipmentJournals.prototype, "FetchJournal", void 0);
__decorate([
    Getter(Getters.JOURNAL_LIST, { namespace: namespace })
], EquipmentJournals.prototype, "Journal", void 0);
__decorate([
    Getter(Getters.JOURNAL_LIST_TOTAL, { namespace: namespace })
], EquipmentJournals.prototype, "TotalItems", void 0);
__decorate([
    Getter(Getters.CURRENT_FILTER, { namespace: namespace })
], EquipmentJournals.prototype, "Filter", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace: namespace })
], EquipmentJournals.prototype, "SetFilter", void 0);
EquipmentJournals = __decorate([
    Component({
        components: {
            JournalFilter,
            Datatable
        }
    })
], EquipmentJournals);
export default EquipmentJournals;
//# sourceMappingURL=index.js.map