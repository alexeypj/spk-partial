import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IFilter, createFilter, StatusDictionary } from "../../../Store/Modules/Vulnerabilities/types";
import { Getter } from "vuex-class";
import { Getters } from "../../../Store/Modules/Vulnerabilities/constants";
import "vue-date-pick/dist/vueDatePick.css";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";

@Component({
    components: {
        select2
    }
})
export default class VulnerabilitiesFilter extends Vue {

    @Prop({ required: true })
    public readonly Filter: IFilter;

    @Watch("Filter")
    public onFilterChange(newVal: IFilter) {
        this.model = { ...newVal };
    }

    @Prop({ required: true })
    public Dictionaries: any;

    @Prop({ required: true })
    public IsLoading: boolean;

    private model: IFilter = createFilter();

    private get Statuses(): IDictionaryItem[] {
        const result = Array<IDictionaryItem>();
        for (let i = 0; i < 4; i++) {
            result.push(<IDictionaryItem> { Key: i, Value: StatusDictionary[i] });
        }
        return result;
   }

    public mounted(): void {
        this.model = { ...this.Filter };
    }

    private resetFilter(): void {
        this.$emit("resetFilter");
    }

    private applyFilter(): void {
        this.$emit("applyFilter", this.model);
    }

    get dateAttributes(): any {
        var attrs: any = {
            class: "form-control",
        }
        if (!this.model.UseCreateDate) {
            attrs.disabled = true;
        }
        return attrs;
    }


}
