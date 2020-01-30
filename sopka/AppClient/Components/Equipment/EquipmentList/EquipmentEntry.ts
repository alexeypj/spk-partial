import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IEquipment } from "../../../Store/Modules/Inventory/types";

@Component
export default class EquipmentEntry extends Vue {

    @Prop({required: true})
    public Entry: IEquipment;

    @Prop({required: true})
    public ClickHandler: (key: number) => void;

    @Prop({required: true})
    public SelectedId: number;

    get isSelected(): boolean {
        return this.SelectedId === this.Entry.Id;
    }

    public select(): void {
        this.ClickHandler(this.Entry.Id);
    }
}
