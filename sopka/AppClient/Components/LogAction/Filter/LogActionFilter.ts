import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import {
    ILogActionState, ILogActionFilter, ILogActionDictionaries, GetDefaultFilter
} from "../../../Store/Modules/LogAction/types";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/LogAction/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import DatePick from "vue-date-pick";

@Component({
    components: {
        select2,
        DatePick
    }
})
export default class LogActionFilter extends Vue {

    @Getter(Getters.DICTIONARIES, { namespace: namespace })
    public readonly Dictionaries: ILogActionDictionaries;

    @Getter(Getters.FILTER, { namespace: namespace  })
    public readonly Filter: ILogActionFilter;

    @Getter(Getters.GET_NEW_FILTER, { namespace: namespace  })
    public readonly GetNewFilter: ILogActionFilter;

    @Mutation(Mutations.SET_FILTER, { namespace: namespace  })
    public SetFilter: (filter: ILogActionFilter) => void;

    @Action(Actions.LOAD_LOGS, { namespace: namespace  })
    public ApplyFilter: (filter: ILogActionFilter) => Promise<any>;

    @Watch("Filter")
    public onFilterChange(newVal: ILogActionFilter): void {
        this.model = { ... newVal };
    }

    private model: ILogActionFilter = GetDefaultFilter();

    public mounted(): void {
        this.model = { ...this.Filter };
    }

    public Apply(): void {
        this.$router.push({ path: "/LogAction/" });
        this.model.Page = 1;
        this.SetFilter(this.model);
        this.ApplyFilter(this.model);
    }

    public ResetFilter(): void {
        this.SetFilter(this.GetNewFilter);
        this.$router.push({ path: "/LogAction/" });
        this.model = { ...this.Filter };
        this.ApplyFilter(this.model);
    }

    get dateAttributes(): any {
        var attrs: any = {
            class: "form-control",
        }
        if (!this.model.UsePeriod) {
            attrs.disabled = true;
        }
        return attrs;
    }

}
