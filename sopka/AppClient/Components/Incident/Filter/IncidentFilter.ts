import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import {
    IIncidentCreationDictionaries,
    IIncidentListFilter,
    IIncidentStatus,
    GetDefaultFilter
} from "../../../Store/Modules/Incident/types";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Incident/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import DatePick from "vue-date-pick";
import { IUser } from "../../../Store/Modules/Common/types";
import { Getters as commonGetters, namespace as commonNamespace } from "../../../Store/Modules/Common/constants";

@Component({
    components: {
        select2,
        DatePick
    }
})
export default class IncidentFilter extends Vue {

    @Prop({ required: true })
    public readonly Shortview: boolean;

    @Getter(Getters.GET_DICTIONARIES_FOR_FILTER, { namespace })
    public readonly Dictionaries: IIncidentCreationDictionaries;

    @Getter(Getters.GET_CURRENT_FILTER, { namespace })
    public readonly Filter: IIncidentListFilter;

    @Getter(Getters.GET_NEW_FILTER, { namespace })
    public readonly GetNewFilter: IIncidentListFilter;

    @Getter(Getters.STATUSES, { namespace })
    public readonly Statuses: IIncidentStatus[];

    @Mutation(Mutations.SET_FILTER, { namespace })
    public SetFilter: (filter: IIncidentListFilter) => void;

    @Action(Actions.FETCH_INCIDENTS, {namespace })
    public ApplyFilter: (filter: IIncidentListFilter) => Promise<any>;

    @Getter(commonGetters.CURRENT_USER, { namespace: commonNamespace })
    public readonly CurrentUser: IUser;

    @Watch("Filter")
    public onFilterChange(newVal: IIncidentListFilter): void {
        this.model = {... newVal};
    }

    private model: IIncidentListFilter = GetDefaultFilter();

    public mounted(): void {
        this.model = {...this.Filter};
    }

    public Apply(): void {
        this.$router.push({ path: "/Incident/"});
        this.ApplyFilter(this.model);
        this.SetFilter(this.model);
    }

    public ResetFilter(): void {
        this.SetFilter(this.GetNewFilter);
        this.$router.push({ path: "/Incident/"});
        this.model = {...this.Filter};
        this.ApplyFilter(this.model);
    }

    public get statusOptions(): IDictionaryItem[] {
        return this.Statuses.map(x => <IDictionaryItem> { Key: x.Id, Value: x.Name });
    }

}
