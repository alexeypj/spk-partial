var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.values = [];
        this.optionValues = [];
    }
    onValueChange(value) {
        $(this.$el).val(value).trigger("change");
        if (this.multiple) {
            this.values = [...value];
        }
    }
    onOptionsChange(value) {
        $(this.$el).off().select2("destroy");
        this.init(value);
    }
    mounted() {
        this.$nextTick(() => this.init(this.options));
    }
    init(options) {
        const customId = "___custom";
        if (this.multiple) {
            this.values = [...this.value];
        }
        this.optionValues = options.map(x => {
            if (typeof (x.Key) === "undefined") {
                console.warn("Invalid data type", x);
                return {};
            }
            return { id: x.Key.toString(), text: x.Value };
        });
        if (this.customOptionTitle) {
            this.optionValues.push({ id: customId, text: this.customOptionTitle });
        }
        $(this.$el)
            .select2({ data: this.optionValues, allowClear: this.allowClear, minimumResultsForSearch: this.showSearchInput ? 0 : -1 })
            .val(this.value)
            .trigger("change")
            .on("select2:select", (val) => {
            const value = val.params.data.id;
            if (this.multiple) {
                if (this.values.indexOf(value) === -1) {
                    this.values.push(value);
                    this.$emit("input", this.values, this.$el.getAttribute("id"), this.$el);
                    return;
                }
            }
            this.$emit("input", value, this.$el.getAttribute("id"), this.$el);
        }).on("select2:unselecting", (event) => {
            // const value = (event.params as any).args.data.id;
            if (!this.multiple) {
                this.$emit("input", undefined, this.$el.getAttribute("id"));
            }
        });
        if (this.customOptionTitle) {
            $(this.$el)
                .select2()
                .on("select2:selecting", (event) => {
                const value = event.params.args.data.id;
                if (value === customId) {
                    event.preventDefault();
                    $(this.$el).select2("close");
                    this.$emit("customOptionClick");
                }
            });
        }
        if (this.multiple) {
            $(this.$el)
                .select2()
                .on("select2:unselect", (val) => {
                const value = val.params.data.id;
                const valueInt = parseInt(value, undefined);
                let idx = this.values.indexOf(value);
                if (idx === -1 && !isNaN(valueInt)) {
                    idx = this.values.indexOf(valueInt);
                }
                if (idx !== -1) {
                    this.values.splice(idx, 1);
                }
                this.$emit("input", this.values, this.$el.getAttribute("id"));
            });
        }
    }
    destroyed() {
        if ($(this.$el).data("select2")) {
            $(this.$el).off().select2("destroy");
        }
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "options", void 0);
__decorate([
    Prop()
], default_1.prototype, "value", void 0);
__decorate([
    Prop({ default: false })
], default_1.prototype, "multiple", void 0);
__decorate([
    Prop()
], default_1.prototype, "customOptionTitle", void 0);
__decorate([
    Prop({ default: true })
], default_1.prototype, "allowClear", void 0);
__decorate([
    Prop({ default: true })
], default_1.prototype, "showSearchInput", void 0);
__decorate([
    Watch("value")
], default_1.prototype, "onValueChange", null);
__decorate([
    Watch("options")
], default_1.prototype, "onOptionsChange", null);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=select2.js.map