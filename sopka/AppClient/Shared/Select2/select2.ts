import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ISelect2Option } from "./types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";

@Component
export default class extends Vue {

    @Prop({required: true})
    public readonly options: IDictionaryItem[];

    @Prop()
    public readonly value: string;

    @Prop({default: false})
    public readonly multiple: boolean;

    @Prop()
    public readonly customOptionTitle: string;

    @Prop({ default: true})
    public allowClear: boolean;

    @Prop({ default: true})
    public showSearchInput: boolean;

    @Prop()
    public placeholder: string;

    @Watch("value")
    public onValueChange(value: string) {
        $(this.$el).val(value).trigger("change");
        if (this.multiple) {
            this.values = [...value];
        }
    }

    @Watch("options")
    public onOptionsChange(value: IDictionaryItem[]) {
        $(this.$el).off().select2("destroy");
        this.init(value);
    }

    private values: string[] = [];
    private optionValues: ISelect2Option[] = [];

    public mounted(): void {
        this.$nextTick(() => this.init(this.options));
    }

    private init(options: IDictionaryItem[]): void {
        const customId = "___custom";

        if (this.multiple) {
            this.values = [...this.value];
        }

        this.optionValues = options.map(x => {
            if ((!Number.isFinite(<number>x.Key) && !x.Key) || typeof(x.Key) === "undefined") {
                console.warn("Invalid data type", x);
                return <ISelect2Option> {};
            }
            return <ISelect2Option> {id: x.Key.toString(), text: x.Value };
        });

        if (this.customOptionTitle) {
            this.optionValues.push({id: customId, text: this.customOptionTitle });
        }
        $(this.$el)
            .select2({
                data: this.optionValues,
                allowClear: this.allowClear,
                minimumResultsForSearch: this.showSearchInput ? 0 : -1,
                placeholder: this.placeholder
            })
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
                .select2({
                    allowClear: this.allowClear
                })
            .on("select2:selecting", (event) => {
                const value = (event.params as any).args.data.id;
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
                        idx = this.values.indexOf(<any> valueInt);
                    }
                    if (idx !== -1) {
                        this.values.splice(idx, 1);
                    }
                    this.$emit("input", this.values, this.$el.getAttribute("id"));
            });
        }
    }

    public destroyed(): void {
        if ($(this.$el).data("select2")) {
            $(this.$el).off().select2("destroy");
        }
    }
}
