import Datatable from "../../Shared/Datatable/Datatable.vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import Vue from "vue";
import { IColumnOptions, IColumnFilter, IFilterOptions } from "../../Shared/Datatable/types";
import { Getter, State, Action } from "vuex-class";
import { namespace, Actions, Getters } from "../../Store/Modules/Equipment/constants";
import { namespace as inventoryNamespace, Getters as inventoryGetters } from "../../Store/Modules/Inventory/constants";
import { IEquipmentState, IEquipmentFilter, IEquipmentDictionaries } from "../../Store/Modules/Equipment/types";
import { IEquipment, IDictionaryItem } from "../../Store/Modules/Inventory/types";
import EquipmentDetails from "./EquipmentDetails/EquipmentDetails.vue";
import EquipmentEntry from "./EquipmentList/EquipmentEntry.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
import { Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import SignalRHelper from "../../Shared/SignalR/signalrhelper";

@Component({
    components: {
        Datatable,
        EquipmentDetails,
        EquipmentEntry,
        select2
    }
})
export default class Equipment extends Vue {

    @Prop()
    public readonly Id: number;

    @State(namespace)
    public State: IEquipmentState;

    @Getter(Getters.EQUIPMENT_LIST, { namespace })
    public Equipments: IEquipment[];

    @Getter(Getters.DICTIONARIES, { namespace })
    public Dictionaries: IEquipmentDictionaries;

    @Getter(Getters.NEW_EQUIPMENT_FILTER, { namespace })
    public GetFilter: () => IEquipmentFilter;

    @Action(Actions.FETCH_EQUIPMENT_LIST, { namespace })
    public FetchEquipment: (filter: IEquipmentFilter) => Promise<void>;

    @Getter(inventoryGetters.EQUIPMENT, { namespace: inventoryNamespace })
    public readonly Equipment: IEquipment | null;

    @Action(Actions.FETCH_DICTIONARIES, { namespace })
    public FetchDictionaries: () => Promise<void>;

    @Action(Actions.APPLY_COLUMN_FILTER, { namespace })
    public ApplyColumnFilters: (filters: IColumnFilter[]) => Promise<IEquipment>;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Watch("Id")
    public onIdChange(newVal: number|undefined): void {
        if (newVal) {
            this.selectedEquipmentId = Number(newVal);
            this.showFilters = false;
            if (this.selectedEquipmentId == 0) {
                logAction(LogActions.EquipmentCreateForm);
            } else {
                logAction(LogActions.EquipmentItem, EntityType.Equipment, newVal.toString());
            }
        } else {
            this.showFilters = true;
            this.selectedEquipmentId = null;
            logAction(LogActions.EquipmentIndex);
        }
    }

    private filter: IEquipmentFilter = <IEquipmentFilter> {};
    private unsubscribe: () => void;
    private selectedEquipmentId: number|null = null;
    private showFilters: boolean = true;

    public mounted(): void {
        this.FetchDictionaries().then(() => {
            this.filter = this.GetFilter();
            this.filter = this.restoreFilterParams(this.filter);
            this.FetchEquipment(this.filter);
            this.onIdChange(this.Id);
        });
    }

    public beforeDestroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    public applyFilter(filter: IEquipmentFilter): void {
        if (filter) {
            this.filter = filter;
            this.selectedEquipmentId = null;
            this.FetchEquipment(this.filter);
        }
    }

    public resetFilter(): void {
        this.filter = this.GetFilter();
        this.FetchEquipment(this.filter);
    }

    public openEquipment(key: number): void {
        this.selectedEquipmentId = key;
        this.showFilters = false;
        this.$router.push({ path: "/Equipment/" + key.toString() });
    }

    public cancelEquipment(readonly: boolean): void {

        if (readonly) {
            this.selectedEquipmentId = null;
            this.$router.push("/Equipment");
        }

        if (this.selectedEquipmentId) {
            this.openEquipment(this.selectedEquipmentId);
        } else {
            this.$router.push("/Equipment");
        }
    }

    public get showingEquipment(): boolean {
        return this.selectedEquipmentId !== null;
    }

    public get showHideFiltersBtn(): boolean {
        return this.showingEquipment && this.showFilters;
    }

    public openFilters(): void {
        this.showFilters = true;
    }

    public closeFilters(): void {
        this.showFilters = false;
    }

    private restoreFilterParams(filter: IEquipmentFilter): IEquipmentFilter {
        const objectId: any = this.$router.currentRoute.query.objectId;
        if (objectId) {
            filter.ObjectId = objectId.toString();
        }
        return filter;
    }

    public addEquipment(): void {
        this.$router.push({path: "/Equipment/0" });
    }

    public onStore(id: number): void {
        if (id) {
            this.resetFilter();
            this.openEquipment(id);
        }
    }

    public onRemove(): void {
        this.FetchEquipment(this.filter);
        this.$router.push({path: "/Equipment/" });
    }

    public onFilterTable(filters: IColumnFilter[]): void {
        this.ApplyColumnFilters(filters);
    }

    public get memoryDict(): IDictionaryItem[] {
        return this.Dictionaries.Memory.map(x => <IDictionaryItem> {Key: x.Key, Value: `${x.Value} ${x.Data}Gb`});
    }

    public get hddDict(): IDictionaryItem[] {
        return this.Dictionaries.HDD.map(x => <IDictionaryItem> {Key: x.Key, Value: `${x.Value} ${x.Data}Gb`});
    }

    public get networkAdaptersDict(): IDictionaryItem[] {
        return this.Dictionaries.NetworkAdapters.map(x => <IDictionaryItem> {Key: x.Key, Value: `${x.Value} ${x.Data}Mbps`});
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Name", DisplayName: "Название оборудования", Sort: true, SortColumnName: "Name" },
        { Name: "TypeName", DisplayName: "Тип", Sort: true, SortColumnName: "TypeName" },
        { Name: "NetworkName", DisplayName: "Имя в сети", Sort: true, SortColumnName: "NetworkName" },
        { Name: "Platform", DisplayName: "Аппаратная платформа", Sort: true, SortColumnName: "Platform" },
        { Name: "IP", DisplayName: "IP адрес", Sort: true, SortColumnName: "IP" },
        { Name: "Vlan", DisplayName: "Сегмент (Vlan)", Sort: true, SortColumnName: "Vlan" }
    ];

    get tableFilterOptions(): IFilterOptions[] {
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
}
