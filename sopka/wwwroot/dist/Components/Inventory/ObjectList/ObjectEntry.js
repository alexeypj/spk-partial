var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
let ObjectEntry = class ObjectEntry extends Vue {
    get isSelected() {
        return this.SelectedId === this.Entry.Id;
    }
    select() {
        this.ClickHandler(this.Entry.Id);
    }
};
__decorate([
    Prop({ required: true })
], ObjectEntry.prototype, "Entry", void 0);
__decorate([
    Prop({ required: true })
], ObjectEntry.prototype, "ClickHandler", void 0);
__decorate([
    Prop({ default: 0 })
], ObjectEntry.prototype, "SelectedId", void 0);
ObjectEntry = __decorate([
    Component
], ObjectEntry);
export default ObjectEntry;
//# sourceMappingURL=ObjectEntry.js.map