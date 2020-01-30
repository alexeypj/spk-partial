var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Datatable from "../../Shared/Datatable/Datatable.vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Getter, State, Action } from "vuex-class";
import { namespace, Actions, Getters } from "../../Store/Modules/Equipment/constants";
import { namespace as inventoryNamespace, Getters as inventoryGetters } from "../../Store/Modules/Inventory/constants";
import EquipmentDetails from "./EquipmentDetails/EquipmentDetails.vue";
import EquipmentEntry from "./EquipmentList/EquipmentEntry.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
let Equipment = class Equipment extends Vue {
    constructor() {
        super(...arguments);
        this.filter = {};
        this.selectedEquipmentId = null;
        this.showFilters = true;
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Name", DisplayName: "Название оборудования" },
            { Name: "TypeName", DisplayName: "Тип" },
            { Name: "NetworkName", DisplayName: "Имя в сети" },
            { Name: "Platform", DisplayName: "Аппаратная платформа" },
            { Name: "IP", DisplayName: "IP адрес" },
            { Name: "Vlan", DisplayName: "Сегмент (Vlan)" },
        ];
    }
    onIdChange(newVal) {
        if (newVal) {
            this.selectedEquipmentId = Number(newVal);
            this.showFilters = false;
            if (this.selectedEquipmentId == 0) {
                logAction(LogActions.EquipmentCreateForm);
            }
            else {
                logAction(LogActions.EquipmentItem, EntityType.Equipment, newVal.toString());
            }
        }
        else {
            this.showFilters = true;
            this.selectedEquipmentId = null;
            logAction(LogActions.EquipmentIndex);
        }
    }
    mounted() {
        this.FetchDictionaries().then(() => {
            this.filter = this.GetFilter();
            this.filter = this.restoreFilterParams(this.filter);
            this.FetchEquipment(this.filter);
            this.onIdChange(this.Id);
        });
    }
    beforeDestroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
    applyFilter(filter) {
        if (filter) {
            this.filter = filter;
            this.selectedEquipmentId = null;
            this.FetchEquipment(this.filter);
        }
    }
    resetFilter() {
        this.filter = this.GetFilter();
        this.FetchEquipment(this.filter);
    }
    openEquipment(key) {
        this.selectedEquipmentId = key;
        this.showFilters = false;
        this.$router.push({ path: "/Equipment/" + key.toString() });
    }
    cancelEquipment(readonly) {
        if (readonly) {
            this.selectedEquipmentId = null;
            this.$router.push("/Equipment");
        }
        if (this.selectedEquipmentId) {
            this.openEquipment(this.selectedEquipmentId);
        }
        else {
            this.$router.push("/Equipment");
        }
    }
    get showingEquipment() {
        return this.selectedEquipmentId !== null;
    }
    get showHideFiltersBtn() {
        return this.showingEquipment && this.showFilters;
    }
    openFilters() {
        this.showFilters = true;
    }
    closeFilters() {
        this.showFilters = false;
    }
    restoreFilterParams(filter) {
        const objectId = this.$router.currentRoute.query.objectId;
        if (objectId) {
            filter.ObjectId = objectId.toString();
        }
        return filter;
    }
    addEquipment() {
        this.$router.push({ path: "/Equipment/0" });
    }
    onStore(id) {
        if (id) {
            this.resetFilter();
            this.openEquipment(id);
        }
    }
    onFilterTable(filters) {
        this.ApplyColumnFilters(filters);
    }
    get memoryDict() {
        return this.Dictionaries.Memory.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data}Gb` }));
    }
    get hddDict() {
        return this.Dictionaries.HDD.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data}Gb` }));
    }
    get networkAdaptersDict() {
        return this.Dictionaries.NetworkAdapters.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data}Mbps` }));
    }
    get tableFilterOptions() {
        return [
            {
                ForColumn: "Id",
                FieldName: "Id",
                Placeholder: "Id",
                Type: "text",
                CSSClass: "col-sm-1",
                Value: this.filter ? this.filter.Id : undefined
            },
            {
                ForColumn: "Name",
                FieldName: "Name",
                Placeholder: "Название",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.filter ? this.filter.Name : undefined
            },
            {
                ForColumn: "TypeName",
                FieldName: "TypeId",
                Placeholder: "Тип",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.filter ? this.filter.TypeId : undefined,
                SelectValues: this.Dictionaries.DeviceTypes
            },
            {
                ForColumn: "NetworkName",
                FieldName: "NetworkName",
                Placeholder: "Имя в сети",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.filter ? this.filter.NetworkName : undefined,
            },
            {
                ForColumn: "Platform",
                FieldName: "PlatformId",
                Placeholder: "Аппаратная платформа",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.filter ? this.filter.PlatformId : undefined,
                SelectValues: this.Dictionaries.Platforms
            },
            {
                ForColumn: "IP",
                FieldName: "IP",
                Placeholder: "IP адрес",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.filter ? this.filter.IP : undefined
            },
            {
                ForColumn: "Vlan",
                FieldName: "Vlan",
                Placeholder: "Сегмент (Vlan)",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.filter ? this.filter.Vlan : undefined
            },
        ];
    }
};
__decorate([
    Prop()
], Equipment.prototype, "Id", void 0);
__decorate([
    State(namespace)
], Equipment.prototype, "State", void 0);
__decorate([
    Getter(Getters.EQUIPMENT_LIST, { namespace })
], Equipment.prototype, "Equipments", void 0);
__decorate([
    Getter(Getters.DICTIONARIES, { namespace })
], Equipment.prototype, "Dictionaries", void 0);
__decorate([
    Getter(Getters.NEW_EQUIPMENT_FILTER, { namespace })
], Equipment.prototype, "GetFilter", void 0);
__decorate([
    Action(Actions.FETCH_EQUIPMENT_LIST, { namespace })
], Equipment.prototype, "FetchEquipment", void 0);
__decorate([
    Getter(inventoryGetters.EQUIPMENT, { namespace: inventoryNamespace })
], Equipment.prototype, "Equipment", void 0);
__decorate([
    Action(Actions.FETCH_DICTIONARIES, { namespace })
], Equipment.prototype, "FetchDictionaries", void 0);
__decorate([
    Action(Actions.APPLY_COLUMN_FILTER, { namespace })
], Equipment.prototype, "ApplyColumnFilters", void 0);
__decorate([
    Watch("Id")
], Equipment.prototype, "onIdChange", null);
Equipment = __decorate([
    Component({
        components: {
            Datatable,
            EquipmentDetails,
            EquipmentEntry,
            select2
        }
    })
], Equipment);
export default Equipment;
//# sourceMappingURL=index.js.map