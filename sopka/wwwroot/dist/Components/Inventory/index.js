var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import ObjectList from "./ObjectList/ObjectList.vue";
import { Action, Getter, Mutation, State } from "vuex-class";
import EquipmentList from "./EquipmentList/EquipmentList.vue";
import ObjectDetails from "./ObjectDetails/ObjectDetails.vue";
import { Actions, Getters, Mutations, namespace } from "../../Store/Modules/Inventory/constants";
import yMap from "./yMap/yMap.vue";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
let Inventory = class Inventory extends Vue {
    constructor() {
        super(...arguments);
        this.searchString = "";
        this.minimunSearchStringLength = 2;
        this.readonly = true;
        /** Для поиска по строке адреса, чтобы карта не обновлялась 2 раза */
        this.searchAddressStr = "";
        /** Для поиска по координатам */
        this.searchCoordinates = { Address: "", Latitude: null, Longitude: null };
        /** Для обновления редактируемого объекта */
        this.searchAddress = { Address: "", Latitude: null, Longitude: null };
    }
    onIdChange(newVal) {
        if (newVal) {
            let val = Number(newVal);
            this.SetSelectedId(val);
            if (val === 0) {
                logAction(LogActions.InventoryCreateForm);
                this.readonly = false;
            }
            else {
                logAction(LogActions.InventoryItem, EntityType.Inventory, newVal.toString());
                this.readonly = true;
            }
        }
        else {
            logAction(LogActions.InventoryIndex);
            this.SetSelectedId(null);
        }
    }
    mounted() {
        if (this.Id) {
            this.onIdChange(this.Id);
        }
        else {
            logAction(LogActions.InventoryIndex);
        }
    }
    search() {
        if (this.searchString.length >= this.minimunSearchStringLength || this.searchString.length === 0) {
            this.fetchObjectList({
                SearchString: this.searchString
            });
        }
    }
    trySearch(e) {
        if (e.keyCode === 13) {
            this.search();
        }
    }
    create() {
        this.$router.push({ path: "/Inventory/0" });
        this.SetSelectedId(0);
        this.searchAddress = { Address: "", Latitude: null, Longitude: null };
        this.searchAddressStr = "";
    }
    get mapKey() {
        if (this.Objects.length > 0) {
            let result = "";
            for (const o of this.Objects) {
                result = result.concat(o.Id.toString(), "_");
                return result;
            }
        }
        return "map__";
    }
    mapSearch(address, name) {
        this.searchAddressStr = address;
    }
    setCoordinates(address, latitude, longitude) {
        this.searchAddress = { Address: address, Latitude: latitude, Longitude: longitude };
    }
    changedCoordinates(latitude, longitude) {
        this.searchCoordinates = { Address: "", Latitude: latitude, Longitude: longitude };
    }
    refreshList() {
        this.fetchObjectList();
        this.close();
    }
    edit() {
        this.readonly = false;
    }
    close() {
        this.SetSelectedId(null);
        this.$router.push({ path: "/Inventory" });
    }
    cancel() {
        this.readonly = true;
    }
    onStoreHandler(id) {
        this.FetchObjects()
            .then(() => {
            this.SetSelectedId(id);
            this.$router.push({ path: "/Inventory/" + id.toString() });
            this.cancel();
        });
    }
};
__decorate([
    Prop()
], Inventory.prototype, "Id", void 0);
__decorate([
    State(namespace)
], Inventory.prototype, "State", void 0);
__decorate([
    Action(Actions.FETCH_OBJECT_LIST, { namespace })
], Inventory.prototype, "fetchObjectList", void 0);
__decorate([
    Getter(Getters.SELECTED_ID, { namespace })
], Inventory.prototype, "SelectedObjectId", void 0);
__decorate([
    Getter(Getters.SELECTED_OBJECT, { namespace })
], Inventory.prototype, "SelectedObject", void 0);
__decorate([
    Getter(Getters.OBJECTS, { namespace })
], Inventory.prototype, "Objects", void 0);
__decorate([
    Mutation(Mutations.SET_SELECTED_ID, { namespace })
], Inventory.prototype, "SetSelectedId", void 0);
__decorate([
    Action(Actions.REMOVE_OBJECT, { namespace })
], Inventory.prototype, "RemoveObject", void 0);
__decorate([
    Action(Actions.STORE_OBJECT, { namespace })
], Inventory.prototype, "StoreObject", void 0);
__decorate([
    Action(Actions.FETCH_OBJECT_LIST, { namespace })
], Inventory.prototype, "FetchObjects", void 0);
__decorate([
    Watch("Id")
], Inventory.prototype, "onIdChange", null);
Inventory = __decorate([
    Component({
        components: {
            ObjectList,
            EquipmentList,
            ObjectDetails,
            yMap
        }
    })
], Inventory);
export default Inventory;
//# sourceMappingURL=index.js.map