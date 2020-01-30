import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IFilterOptions } from "../types";
import select2 from "../../Select2/select2.vue";
import DatePick from "vue-date-pick";

@Component({
    components: {
        select2,
        DatePick
    }
})
export default class extends Vue {

    @Prop({ required: true })
    public readonly options: IFilterOptions;

    private updateValue(value: string | Event): void {
        if (this.options) {
            if(typeof(value) === "object") {
                const scalarValue = (value.target as HTMLInputElement).value;
                value = scalarValue;
            }
            console.log('value', value);
            if (this.options.Type === "date" || this.options.Type === "datetime") {
                this.$set(this.options, "Value", value);
            }
            this.$emit("change", this.options.FieldName, value);
        }
    }
}
