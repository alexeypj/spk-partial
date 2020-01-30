var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { namespace, Getters } from "../../../Store/Modules/LogAction/constants";
let LogDetails = class LogDetails extends Vue {
    get logParameters() {
        if (!this.SelectedLog || !this.SelectedLog.Parameters) {
            return [];
        }
        var paramsObj = JSON.parse(this.SelectedLog.Parameters);
        if (Object.keys(paramsObj).length === 0) {
            return [];
        }
        let params = [];
        for (var key in paramsObj) {
            if (!paramsObj.hasOwnProperty(key)) {
                continue;
            }
            let content = "";
            if (paramsObj[key] instanceof Object) {
                content = JSON.stringify(paramsObj[key]);
            }
            else {
                content = paramsObj[key];
            }
            params.push({ Key: key, Value: content });
        }
        return params;
    }
};
__decorate([
    Getter(Getters.GET_SELECTED_LOG, { namespace: namespace })
], LogDetails.prototype, "SelectedLog", void 0);
LogDetails = __decorate([
    Component
], LogDetails);
export default LogDetails;
//# sourceMappingURL=LogDetails.js.map