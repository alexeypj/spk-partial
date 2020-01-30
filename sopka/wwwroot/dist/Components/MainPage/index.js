var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Actions, namespace } from "../../Store/Modules/Inventory/constants";
import { Actions as commonActions, Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import infTable from "./infTable/infTable.vue";
import smallMessage from "./smallMessage/smallMessage.vue";
import mailBoard from "./mailBoard/mailBoard.vue";
import SmallMap from "./smallMap/smallMap.vue";
import { Action, Getter } from "vuex-class";
let MainPage = class MainPage extends Vue {
    constructor() {
        super(...arguments);
        this.summary = {
            Objects: [],
            Counters: []
        };
        this.initialized = false;
    }
    mounted() {
        this.FetchSettings();
        this.FetchSummary().then((result) => {
            this.summary = result;
            this.initialized = true;
        });
    }
};
__decorate([
    Action(Actions.FETCH_SUMMARY, { namespace })
], MainPage.prototype, "FetchSummary", void 0);
__decorate([
    Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
], MainPage.prototype, "FetchSettings", void 0);
__decorate([
    Getter(commonGetters.SETTINGS, { namespace: commonNamespace })
], MainPage.prototype, "Settings", void 0);
MainPage = __decorate([
    Component({
        components: {
            infTable,
            smallMessage,
            mailBoard,
            SmallMap
        }
    })
], MainPage);
export default MainPage;
//# sourceMappingURL=index.js.map