var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { Actions, Getters, Mutations, namespace } from "../../../Store/Modules/Inventory/constants";
import Datatable from "../../../Shared/Datatable/Datatable.vue";
let EquipmentList = class EquipmentList extends Vue {
    constructor() {
        super(...arguments);
        this.filter = {};
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Name", DisplayName: "Название оборудования" },
            { Name: "TypeName", DisplayName: "Тип" },
            { Name: "NetworkName", DisplayName: "Имя в сети" },
            { Name: "Platform", DisplayName: "Аппаратная платформа" },
            { Name: "IP", DisplayName: "IP адрес" },
            { Name: "Vlan", DisplayName: "Сегмент (vlan)" },
        ];
    }
    mounted() {
        this.filter = this.GetFilter(this.Id);
        this.FetchEquipment(this.filter);
        this.unsubscribe = this.$store.watch(() => this.$store.getters[namespace + "/" + Getters.SELECTED_ID], () => {
            this.filter = this.GetFilter(this.Id);
            this.FetchEquipment(this.filter);
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
            this.FetchEquipment(this.filter);
        }
    }
    selectEquipmentId(id) {
        this.$router.push({ path: "/Equipment/" + id.toString() });
        // document.location.href = urlHelper("", "Equipment") + `?id=${id}&objectId=${this.Id}`;
    }
    addEquipment() {
        this.selectEquipmentId(0);
    }
    remove(item) {
        bootbox.confirm({ message: `Вы уверены что хотите удалить ${item.Name}?`, animate: false,
            buttons: {
                confirm: {
                    label: "Подтвердить",
                    className: "btn-success"
                },
                cancel: {
                    label: "Отмена",
                    className: "btn-white"
                }
            },
            callback: (result) => {
                if (result) {
                    this.RemoveEquipment(item.Id)
                        .then(() => this.FetchEquipment(this.filter));
                }
            }
        });
    }
};
__decorate([
    Prop({ default: true })
], EquipmentList.prototype, "IsReadonly", void 0);
__decorate([
    State(namespace)
], EquipmentList.prototype, "State", void 0);
__decorate([
    Getter(Getters.EQUIPMENT_LIST, { namespace })
], EquipmentList.prototype, "EquipmentList", void 0);
__decorate([
    Getter(Getters.SELECTED_ID, { namespace })
], EquipmentList.prototype, "Id", void 0);
__decorate([
    Getter(Getters.NEW_EQUIPMENT_FILTER, { namespace })
], EquipmentList.prototype, "GetFilter", void 0);
__decorate([
    Action(Actions.FETCH_EQUIPMENT_LIST, { namespace })
], EquipmentList.prototype, "FetchEquipment", void 0);
__decorate([
    Action(Actions.REMOVE_EQUIPMENT, { namespace })
], EquipmentList.prototype, "RemoveEquipment", void 0);
__decorate([
    Mutation(Mutations.SET_SELECTED_ID, { namespace })
], EquipmentList.prototype, "SelectIdImpl", void 0);
EquipmentList = __decorate([
    Component({
        components: {
            Datatable
        }
    })
], EquipmentList);
export default EquipmentList;
//# sourceMappingURL=EquipmentList.js.map