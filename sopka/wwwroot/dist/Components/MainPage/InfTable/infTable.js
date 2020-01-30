var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { isUserInRole } from "../../../Shared/utils";
import { Getter } from "vuex-class";
import { namespace, Getters } from "../../../Store/Modules/Common/constants";
import { Roles } from "../../../Store/Modules/Common/types";
let default_1 = class default_1 extends Vue {
    get DisplayEquipments() {
        return isUserInRole(this.CurrentUser, Roles.DutyShift) ||
            isUserInRole(this.CurrentUser, Roles.Admin);
    }
    get objectsTotal() {
        return this.getCounter("Objects");
    }
    get equipmentTotal() {
        return this.getCounter("Equipment");
    }
    get incidentsTotal() {
        return this.getCounter("Incidents");
    }
    get objectIncidents() {
        return this.getCounter("ObjectIncidents");
    }
    get equipmentIncidents() {
        return this.getCounter("EquipmentIncidents");
    }
    get openIncidents() {
        return this.getCounter("OpenIncidents");
    }
    get newIncidents() {
        return this.getCounter("NewIncidents");
    }
    getCounter(type) {
        const counter = this.counters.find(x => x.Type === type);
        if (counter) {
            return counter.Value;
        }
        return 0;
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "counters", void 0);
__decorate([
    Getter(Getters.CURRENT_USER, { namespace })
], default_1.prototype, "CurrentUser", void 0);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=infTable.js.map