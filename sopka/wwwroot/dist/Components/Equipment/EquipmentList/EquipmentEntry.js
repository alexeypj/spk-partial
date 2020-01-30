var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
let EquipmentEntry = class EquipmentEntry extends Vue {
    get isSelected() {
        return this.SelectedId === this.Entry.Id;
    }
    select() {
        this.ClickHandler(this.Entry.Id);
    }
};
__decorate([
    Prop({ required: true })
], EquipmentEntry.prototype, "Entry", void 0);
__decorate([
    Prop({ required: true })
], EquipmentEntry.prototype, "ClickHandler", void 0);
__decorate([
    Prop({ required: true })
], EquipmentEntry.prototype, "SelectedId", void 0);
EquipmentEntry = __decorate([
    Component
], EquipmentEntry);
export default EquipmentEntry;
//# sourceMappingURL=EquipmentEntry.js.map