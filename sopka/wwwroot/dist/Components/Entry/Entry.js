var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace } from "../../Store/Modules/Common/constants";
import { Action, Getter } from "vuex-class";
import { Getters } from "../../Store/Modules/Common/constants";
import { Roles } from "../../Store/Modules/Common/types";
import { isUserInRole } from "../../Shared/utils";
import { Actions as commonActions, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.path = '/Incident';
    }
    onUrlChange(newVal) {
        this.path = this.$route.path;
    }
    mounted() {
        this.FetchSettings();
    }
    get DisplayEquipments() {
        return true;
    }
    get DisplayInventories() {
        return true;
    }
    get DisplayIncidents() {
        return true;
    }
    get DisplayPost() {
        return true;
    }
    get DisplayMessages() {
        return true;
    }
    get DisplayVulnerabilities() {
        return true;
    }
    get DisplayUsers() {
        return isUserInRole(this.CurrentUser, Roles.Admin);
    }
    get DisplayKnowledgeBase() {
        return true;
    }
    get DisplayDictionaries() {
        return true;
    }
    get DisplayEquipmentLogs() {
        //return isUserInRole(this.CurrentUser, Roles.Admin);
        return true; // ����� ������� ����� ������� ��� �����
    }
    get DisplayLogAction() {
        return isUserInRole(this.CurrentUser, Roles.Admin);
        ;
    }
};
__decorate([
    Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
], default_1.prototype, "FetchSettings", void 0);
__decorate([
    Getter(Getters.SETTINGS, { namespace: namespace })
], default_1.prototype, "Settings", void 0);
__decorate([
    Getter(Getters.IS_ADMIN, { namespace })
], default_1.prototype, "IsAdmin", void 0);
__decorate([
    Getter(Getters.IS_AUTHENTICATED, { namespace })
], default_1.prototype, "IsAuthenticated", void 0);
__decorate([
    Getter(Getters.ASSEMBLY, { namespace })
], default_1.prototype, "Assembly", void 0);
__decorate([
    Getter(Getters.CURRENT_USER, { namespace })
], default_1.prototype, "CurrentUser", void 0);
__decorate([
    Watch('$route', { immediate: true, deep: true })
], default_1.prototype, "onUrlChange", null);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=Entry.js.map