var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { formatDate } from "../../../../Shared/utils";
let RelatedIncidents = class RelatedIncidents extends Vue {
    getAttachType(id) {
        if (id) {
            const attackType = this.Dictionaries.AttackTypes.find(x => x.Key === id);
            if (attackType) {
                return attackType.Value;
            }
        }
        return "";
    }
    dateFormat(date) {
        return formatDate(date, "DD.MM.YYYY HH:mm:ss");
    }
    getType(type) {
        if (type === 0) {
            return "Статья основана на инциденте";
        }
        if (type === 1) {
            return "Статья решает инцидент";
        }
        if (type === 2) {
            return "Статья основана на инциденте и решает его";
        }
        return "";
    }
};
__decorate([
    Prop({ required: true })
], RelatedIncidents.prototype, "Incidents", void 0);
__decorate([
    Prop({ required: true })
], RelatedIncidents.prototype, "Dictionaries", void 0);
RelatedIncidents = __decorate([
    Component
], RelatedIncidents);
export default RelatedIncidents;
//# sourceMappingURL=relatedIncidents.js.map