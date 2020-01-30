var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import { namespace, Mutations } from "../../../Store/Modules/LogAction/constants";
let LogDetailsCell = class LogDetailsCell extends Vue {
    onLogSelect() {
        this.SetSelectedLog(this.Item);
    }
};
__decorate([
    Prop({ required: true })
], LogDetailsCell.prototype, "Item", void 0);
__decorate([
    Mutation(Mutations.SET_SELECTED_LOG, { namespace: namespace })
], LogDetailsCell.prototype, "SetSelectedLog", void 0);
LogDetailsCell = __decorate([
    Component
], LogDetailsCell);
export default LogDetailsCell;
//# sourceMappingURL=logDetailsCell.js.map