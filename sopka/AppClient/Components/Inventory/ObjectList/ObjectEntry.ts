import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IObjectEntry } from "../../../Store/Modules/Inventory/types";

@Component
export default class ObjectEntry extends Vue {

    @Prop({required: true})
    Entry: IObjectEntry;

    @Prop({required: true})
    ClickHandler:(id: number) => void;

    @Prop({default: 0})
    SelectedId: number;

    get isSelected(): boolean {
        return this.SelectedId === this.Entry.Id;
    }

    select(): void {
        this.ClickHandler(this.Entry.Id);
    }
}