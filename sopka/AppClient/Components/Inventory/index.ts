import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import ObjectList from "./ObjectList/ObjectList.vue";
import { Action, Getter, Mutation, State } from "vuex-class";
import { IObjectEntry, IInventoryFilter, IInventoryState, IAddress, IEquipment } from "../../Store/Modules/Inventory/types";
import EquipmentList from "./EquipmentList/EquipmentList.vue";
import ObjectDetails from "./ObjectDetails/ObjectDetails.vue";
import { Actions, Getters, Mutations, namespace } from "../../Store/Modules/Inventory/constants";
import yMap from "./yMap/yMap.vue";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions"
import { Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";

@Component({
    components: {
        ObjectList,
        EquipmentList,
        ObjectDetails,
        yMap
    }
})
export default class Inventory extends Vue {

    @Prop()
    public readonly Id: number;

    @State(namespace)
    private State: IInventoryState;

    @Action(Actions.FETCH_OBJECT_LIST, { namespace })
    private fetchObjectList: (filter?: IInventoryFilter) => Promise<void>;

    @Getter(Getters.SELECTED_ID, { namespace })
    private SelectedObjectId: number| null;

    @Getter(Getters.SELECTED_OBJECT, { namespace })
    private SelectedObject: IObjectEntry|null;

    @Getter(Getters.OBJECTS, { namespace })
    public readonly Objects: IObjectEntry[];

    @Mutation(Mutations.SET_SELECTED_ID, { namespace })
    private SetSelectedId: (id: number | null) => void;

    @Action(Actions.REMOVE_OBJECT, { namespace })
    public readonly RemoveObject: (id: number) => Promise<boolean>;

    @Action(Actions.STORE_OBJECT, { namespace })
    public readonly StoreObject: (model: IObjectEntry) => Promise<IObjectEntry|string[]>;

    @Action(Actions.FETCH_OBJECT_LIST, { namespace })
    public readonly FetchObjects: () => Promise<void>;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    public searchString: string = "";
    private readonly minimunSearchStringLength = 2;
    private readonly: boolean = true;

    /** Для поиска по строке адреса, чтобы карта не обновлялась 2 раза */
    private searchAddressStr = "";
    /** Для поиска по координатам */
    private searchCoordinates: IAddress = { Address: "", Latitude: null, Longitude: null };
    /** Для обновления редактируемого объекта */
    private searchAddress: IAddress = { Address: "", Latitude: null, Longitude: null };

    private ObjectName = "";

    @Watch("Id")
    public onIdChange(newVal: number|undefined): void {
        if (newVal) {
            let val = Number(newVal);
            this.SetSelectedId(val);
            if (val === 0) {
                logAction(LogActions.InventoryCreateForm);
                this.readonly = false;
            } else {
                this.readonly = true;
            }
        } else {
            logAction(LogActions.InventoryIndex);
            this.SetSelectedId(null);
        }
    }

    @Watch("SelectedObject", { deep: true})
    public onSelectedObjectChange(newVal: IObjectEntry | null, oldVal: IObjectEntry | null): void {
        if (!newVal || newVal === null) {
            this.ObjectName = "";
            return;
        } else {
            this.ObjectName = newVal.ObjectName;
            if (!oldVal || oldVal.Id !== newVal.Id) {
                logAction(LogActions.InventoryItem, EntityType.Inventory, newVal.Id.toString(), null, newVal.ObjectName);
            }
        }
    }

    public mounted(): void {
        this.onIdChange(this.Id);
        logAction(LogActions.InventoryIndex);
    }

    public search(): void {
          if (this.searchString.length >= this.minimunSearchStringLength || this.searchString.length === 0) {
            this.fetchObjectList({
                SearchString: this.searchString
            });
          }
    }

    public trySearch(e: KeyboardEvent): void {
        if (e.keyCode === 13) {
            this.search();
        }
    }

    public create(): void {
        this.$router.push({ path: "/Inventory/0" });
        this.SetSelectedId(0);
        this.searchAddress = { Address: "", Latitude: null, Longitude: null };
        this.searchAddressStr = "";
    }

    public get mapKey(): string {
        if (this.Objects.length > 0) {
            let result = "";
            for (const o of this.Objects) {
                result = result.concat(o.Id.toString(), "_");
                return result;
            }
        }
        return "map__";
    }

    private mapSearch(address: string, name: string) {
        this.searchAddressStr = address;
    }

    private setCoordinates(address: string, latitude: number, longitude: number) {
        this.searchAddress = { Address: address, Latitude: latitude, Longitude: longitude };
    }

    private changedCoordinates(latitude: number, longitude: number) {
        this.searchCoordinates = { Address: "", Latitude: latitude, Longitude: longitude };
    }

    private refreshList(): void {
        this.fetchObjectList();
        this.close();
    }

    private edit(): void {
        this.readonly = false;
    }

    private close(): void {
        this.SetSelectedId(null);
        this.$router.push({ path: "/Inventory" });
    }

    private cancel(): void {
        this.readonly = true;
    }

    private onStoreHandler(id: number) {
        this.FetchObjects()
            .then(() => {
                this.SetSelectedId(id);
                this.$router.push({ path: "/Inventory/" + id.toString() });
                this.cancel();
            });
    }

}
