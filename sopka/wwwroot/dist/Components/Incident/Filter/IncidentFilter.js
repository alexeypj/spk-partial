var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { GetDefaultFilter } from "../../../Store/Modules/Incident/types";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Incident/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import DatePick from "vue-date-pick";
let IncidentFilter = class IncidentFilter extends Vue {
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
        this.$router.push({ path: "/Incident/" });
        this.ApplyFilter(this.model);
        this.SetFilter(this.model);
    }
    ResetFilter() {
        this.SetFilter(this.GetNewFilter);
        this.$router.push({ path: "/Incident/" });
        this.model = Object.assign({}, this.Filter);
        this.ApplyFilter(this.model);
    }
    get statusOptions() {
        return this.Statuses.map(x => ({ Key: x.Id, Value: x.Name }));
    }
};
__decorate([
    Prop({ required: true })
], IncidentFilter.prototype, "Shortview", void 0);
__decorate([
    Getter(Getters.GET_DICTIONARIES_FOR_FILTER, { namespace })
], IncidentFilter.prototype, "Dictionaries", void 0);
__decorate([
    Getter(Getters.GET_CURRENT_FILTER, { namespace })
], IncidentFilter.prototype, "Filter", void 0);
__decorate([
    Getter(Getters.GET_NEW_FILTER, { namespace })
], IncidentFilter.prototype, "GetNewFilter", void 0);
__decorate([
    Getter(Getters.STATUSES, { namespace })
], IncidentFilter.prototype, "Statuses", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace })
], IncidentFilter.prototype, "SetFilter", void 0);
__decorate([
    Action(Actions.FETCH_INCIDENTS, { namespace })
], IncidentFilter.prototype, "ApplyFilter", void 0);
__decorate([
    Watch("Filter")
], IncidentFilter.prototype, "onFilterChange", null);
IncidentFilter = __decorate([
    Component({
        components: {
            select2,
            DatePick
        }
    })
], IncidentFilter);
export default IncidentFilter;
//# sourceMappingURL=IncidentFilter.js.map