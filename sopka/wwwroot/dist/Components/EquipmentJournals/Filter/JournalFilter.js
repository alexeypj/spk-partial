var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { createFilter } from "../../../Store/Modules/EquipmentJournals/types";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/EquipmentJournals/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";
let JournalFilter = class JournalFilter extends Vue {
    constructor() {
        super(...arguments);
        //@Watch("Filter")
        //public onFilterChange(newVal: IEquipmentJournalFilter): void {
        //    this.model = { ... newVal };
        //}
        this.model = createFilter();
    }
    mounted() {
        this.model = Object.assign({}, this.Filter);
        this.onEquipmentTypeIdChange(this.Filter.EquipmentTypeId);
        this.onPlatformIdChange(this.Filter.PlatformId);
    }
    Apply() {
        this.$router.push({ path: "/EquipmentJournals/" });
        this.model.Page = 1;
        this.SetFilter(this.model);
        this.ApplyFilter(this.model);
        this.onEquipmentTypeIdChange(this.Filter.EquipmentTypeId);
        this.onPlatformIdChange(this.Filter.PlatformId);
    }
    ResetFilter() {
        var newFilter = this.GetNewFilter;
        newFilter.ItemsPerPage = this.Filter.ItemsPerPage;
        this.SetFilter(newFilter);
        this.$router.push({ path: "/EquipmentJournals/" });
        this.model = Object.assign({}, this.Filter);
        this.ApplyFilter(this.model);
        this.onEquipmentTypeIdChange(this.Filter.EquipmentTypeId);
        this.onPlatformIdChange(this.Filter.PlatformId);
    }
    get dateAttributes() {
        var attrs = {
            class: "form-control",
        };
        if (!this.model.UsePeriod) {
            attrs.disabled = "";
        }
        return attrs;
    }
    onEquipmentTypeIdChange(value) {
        if (value && value > 0) {
            $("#PlatformId").prop("disabled", false);
        }
        else {
            this.model.PlatformId = undefined;
            $("#PlatformId").val("").trigger("change");
            $("#PlatformId").prop("disabled", true);
            this.onPlatformIdChange(undefined);
        }
    }
    onPlatformIdChange(value) {
        this.model.PlatformId = value;
        if (value && value > 0) {
            $("#EquipmentId").prop("disabled", false);
        }
        else {
            this.model.EquipmentId = undefined;
            $("#EquipmentId").val("").trigger("change");
            $("#EquipmentId").prop("disabled", true);
        }
    }
};
__decorate([
    Getter(Getters.DICTIONARIES, { namespace: namespace })
], JournalFilter.prototype, "Dictionaries", void 0);
__decorate([
    Getter(Getters.CURRENT_FILTER, { namespace: namespace })
], JournalFilter.prototype, "Filter", void 0);
__decorate([
    Getter(Getters.NEW_FILTER, { namespace: namespace })
], JournalFilter.prototype, "GetNewFilter", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace: namespace })
], JournalFilter.prototype, "SetFilter", void 0);
__decorate([
    Action(Actions.FETCH_LIST, { namespace: namespace })
], JournalFilter.prototype, "ApplyFilter", void 0);
JournalFilter = __decorate([
    Component({
        components: {
            select2,
            DatePick
        }
    })
], JournalFilter);
export default JournalFilter;
//# sourceMappingURL=JournalFilter.js.map