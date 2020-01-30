var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import select2 from "../../Select2/select2.vue";
import DatePick from "vue-date-pick";
let default_1 = class default_1 extends Vue {
    updateValue(value) {
        if (this.options) {
            if (typeof (value) === "object") {
                const scalarValue = value.target.value;
                value = scalarValue;
            }
            console.log('value', value);
            if (this.options.Type === "date" || this.options.Type === "datetime") {
                this.$set(this.options, "Value", value);
            }
            this.$emit("change", this.options.FieldName, value);
        }
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "options", void 0);
default_1 = __decorate([
    Component({
        components: {
            select2,
            DatePick
        }
    })
], default_1);
export default default_1;
//# sourceMappingURL=filters.js.map