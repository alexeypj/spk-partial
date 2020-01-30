var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { GetDefaultFilter } from "../../../Store/Modules/LogAction/types";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/LogAction/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import DatePick from "vue-date-pick";
let LogActionFilter = class LogActionFilter extends Vue {
    constructor() {
        super(...arguments);
        this.model = GetDefaultFilter();
    }
    onFilterChange(newVal) {
        this.model = Object.assign({}, newVal);
    }
    mounted() {
        this.model = Object.assign({}, this.Filter);
    }
    Apply() {
        this.$router.push({ path: "/LogAction/" });
        this.model.Page = 1;
        this.SetFilter(this.model);
        this.ApplyFilter(this.model);
    }
    ResetFilter() {
        this.SetFilter(this.GetNewFilter);
        this.$router.push({ path: "/LogAction/" });
        this.model = Object.assign({}, this.Filter);
        this.ApplyFilter(this.model);
    }
};
__decorate([
    Getter(Getters.DICTIONARIES, { namespace: namespace })
], LogActionFilter.prototype, "Dictionaries", void 0);
__decorate([
    Getter(Getters.FILTER, { namespace: namespace })
], LogActionFilter.prototype, "Filter", void 0);
__decorate([
    Getter(Getters.GET_NEW_FILTER, { namespace: namespace })
], LogActionFilter.prototype, "GetNewFilter", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace: namespace })
], LogActionFilter.prototype, "SetFilter", void 0);
__decorate([
    Action(Actions.LOAD_LOGS, { namespace: namespace })
], LogActionFilter.prototype, "ApplyFilter", void 0);
__decorate([
    Watch("Filter")
], LogActionFilter.prototype, "onFilterChange", null);
LogActionFilter = __decorate([
    Component({
        components: {
            select2,
            DatePick
        }
    })
], LogActionFilter);
export default LogActionFilter;
//# sourceMappingURL=LogActionFilter.js.map