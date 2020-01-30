import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import IncidentChart from "./IncidentChart.vue"
import { IncidentStatisticGroupType, IncidentStatisticPeriodType  } from "./types";
import { Actions, namespace } from "../../../../Store/Modules/Incident/constants";
import { IIncidentStatistic, IIncidentStatisticFilter } from "../../../../Store/Modules/Incident/types";
import "vue-date-pick/dist/vueDatePick.css";


@Component({
    components: {
        IncidentChart
    }
})
export default class Charts extends Vue {
    PeriodTypes = IncidentStatisticPeriodType;

    @Action(Actions.FETCH_STATISTICS, {namespace: namespace})
    FetchStatistic: (filter: IIncidentStatisticFilter) => Promise<IIncidentStatistic>;

    Statistic: IIncidentStatistic | null = null;

    Filter: IIncidentStatisticFilter = {
        GroupType: IncidentStatisticGroupType.Day,
        Period: IncidentStatisticPeriodType.Week,
        DateFrom: "",
        DateTo: ""
    }

    mounted() {
        this.loadStatistic();
    }

    setPeriod(period: string): void {
        this.Filter.Period = period;
        this.loadStatistic();
    }

    setGroupType(groupType: string): void {
        this.Filter.GroupType = groupType;
        this.loadStatistic();
    }

    loadStatistic(): void {
        this.FetchStatistic(this.Filter)
            .then(stat => this.Statistic = stat);
    }
}