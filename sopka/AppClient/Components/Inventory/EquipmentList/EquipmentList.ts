import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { Actions, Getters, Mutations, namespace } from "../../../Store/Modules/Inventory/constants";
import { IEquipmentListFilter, IInventoryState, IEquipmentListItem } from "../../../Store/Modules/Inventory/types";
import Datatable from "../../../Shared/Datatable/Datatable.vue";
import { IColumnOptions } from "../../../Shared/Datatable/types";
import { removeConfirmation } from "../../../shared/utils";

@Component({
    components: {
        Datatable
    }
})
export default class EquipmentList extends Vue {

    @Prop({ default: true })
    public IsReadonly: boolean;

    @State(namespace)
    State: IInventoryState;

    @Getter(Getters.EQUIPMENT_LIST, { namespace })
    EquipmentList: Array<IEquipmentListItem>;

    @Getter(Getters.SELECTED_ID, { namespace })
    Id: number;

    @Getter(Getters.NEW_EQUIPMENT_FILTER, { namespace })
    GetFilter: (objectId: number) => IEquipmentListFilter;

    @Action(Actions.FETCH_EQUIPMENT_LIST, { namespace })
    FetchEquipment: (filter: IEquipmentListFilter) => Promise<void>;

    @Action(Actions.REMOVE_EQUIPMENT, { namespace })
    RemoveEquipment: (id: number) => Promise<void>;

    @Mutation(Mutations.SET_SELECTED_ID, { namespace })
    SelectIdImpl:(id: number) => void;

    private filter: IEquipmentListFilter = <IEquipmentListFilter>{};
    private unsubscribe: () => void;

    mounted(): void {
        this.filter = this.GetFilter(this.Id);
        this.FetchEquipment(this.filter);
		this.unsubscribe = this.$store.watch(() => this.$store.getters[namespace + "/" + Getters.SELECTED_ID], () => {
            this.filter = this.GetFilter(this.Id);
            this.FetchEquipment(this.filter);
		});
    }

    public beforeDestroy(): void {
        if(this.unsubscribe) {
            this.unsubscribe();
        }
    }

    public applyFilter(filter: IEquipmentListFilter): void {
        if(filter) {
            this.filter = filter;
            this.FetchEquipment(this.filter);
        }
    }

    public selectEquipmentId(id: number): void {
        this.$router.push({path: "/Equipment/" + id.toString() });
        // document.location.href = urlHelper("", "Equipment") + `?id=${id}&objectId=${this.Id}`;
    }

    public addEquipment(): void {
        this.selectEquipmentId(0);
    }

    public remove(item:IEquipmentListItem): void {
        removeConfirmation(
            `Вы уверены, что хотите удалить <strong>${item.Name}</strong>?`,
            () => this.RemoveEquipment(item.Id).then(() => this.FetchEquipment(this.filter))
        );
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№"},
		{ Name: "Name", DisplayName: "Название оборудования" },
        { Name: "TypeName", DisplayName: "Тип"},
        { Name: "NetworkName", DisplayName: "Имя в сети"},
        { Name: "Platform", DisplayName: "Аппаратная платформа"},
        { Name: "IP", DisplayName: "IP адрес"},
        { Name: "Vlan", DisplayName: "Сегмент (vlan)"},
    ];
}