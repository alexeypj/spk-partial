import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import {
    IEquipmentJournalState, IEquipmentJournalDictionaries, IEquipmentJournalFilter, IEquipmentJournalItem, createFilter
} from "../../../Store/Modules/EquipmentJournals/types";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/EquipmentJournals/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";


@Component({
    components: {
        select2,
        DatePick
    }
})
export default class JournalFilter extends Vue {

    @Getter(Getters.DICTIONARIES, { namespace: namespace })
    public readonly Dictionaries: IEquipmentJournalDictionaries;

    @Getter(Getters.CURRENT_FILTER, { namespace: namespace  })
    public readonly Filter: IEquipmentJournalFilter;

    @Getter(Getters.NEW_FILTER, { namespace: namespace  })
    public readonly GetNewFilter: IEquipmentJournalFilter;

    @Mutation(Mutations.SET_FILTER, { namespace: namespace  })
    public SetFilter: (filter: IEquipmentJournalFilter) => void;

    @Action(Actions.FETCH_LIST, { namespace: namespace  })
    public ApplyFilter: (filter: IEquipmentJournalFilter) => Promise<any>;

    public  model: IEquipmentJournalFilter = createFilter();

    public mounted(): void {
        this.model = { ...this.Filter };
        if (!this.Filter.EquipmentId) {
            this.onEquipmentTypeIdChange(this.Filter.EquipmentTypeId);
            this.onPlatformIdChange(this.Filter.PlatformId);
        }
    }

    public Apply(): void {
        if (!this.validateDatesRange()) {
            return;
        }
        this.$router.push({ path: "/EquipmentJournals/" });
        this.model.Page = 1;
        this.SetFilter(this.model);
        this.ApplyFilter(this.model);
        this.onEquipmentTypeIdChange(this.Filter.EquipmentTypeId);
        this.onPlatformIdChange(this.Filter.PlatformId);
    }

    public ResetFilter(): void {
        var newFilter = this.GetNewFilter;
        newFilter.ItemsPerPage = this.Filter.ItemsPerPage;
        this.SetFilter(newFilter);
        this.$router.push({ path: "/EquipmentJournals/" });
        this.model = { ...this.Filter };
        this.ApplyFilter(this.model);
        this.onEquipmentTypeIdChange(this.Filter.EquipmentTypeId);
        this.onPlatformIdChange(this.Filter.PlatformId);
    }

    private showInvalidDateRangeErrorText: boolean = false;
    private validateDatesRange(): boolean {
        if (!this.model.DateFrom || !this.model.DateTo || !this.model.UsePeriod) {
            this.showInvalidDateRangeErrorText = false;
            return true;
        }
        this.showInvalidDateRangeErrorText = this.model.DateFrom > this.model.DateTo;
        return !this.showInvalidDateRangeErrorText;
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

    onEquipmentTypeIdChange(value: number | undefined): void {
        if (value && value > 0) {
            $("#PlatformId").prop("disabled", false);
        } else {
            this.model.PlatformId = undefined;
            $("#PlatformId").val("").trigger("change");
            $("#PlatformId").prop("disabled", true);
            this.onPlatformIdChange(undefined);
        }
    }

    onPlatformIdChange(value: number | undefined): void {
        this.model.PlatformId = value;
        if (value && value > 0) {
            $("#EquipmentId").prop("disabled", false);
        } else {
            this.model.EquipmentId = undefined;
            $("#EquipmentId").val("").trigger("change");
            $("#EquipmentId").prop("disabled", true);
        }
    }
}
