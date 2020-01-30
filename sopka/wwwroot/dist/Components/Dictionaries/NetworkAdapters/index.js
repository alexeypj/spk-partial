var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { namespace, Actions, Getters } from "../../../Store/Modules/Dictionaries/constants";
import Datatable from "../../../Shared/Datatable/Datatable.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import EditForm from "./EditForm.vue";
import SearchFilter from "./SearchFilter.vue";
import select2 from "../../../Shared/Select2/select2.vue";
let NetworkAdapter = class NetworkAdapter extends Vue {
    constructor() {
        super(...arguments);
        this.showCreateModal = false;
        this.showFilterModal = false;
        this.selectedObjectTypeIndex = null;
        this.modalTitle = "Добавить сетевой адаптер";
        this.showError = false;
        this.errorText = "";
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Title", DisplayName: "Название" },
            { Name: "Speed", DisplayName: "Скорость" }
        ];
        this.actionValue = '';
    }
    created() {
        this.additionalFilter = Object.assign({}, this.State.Filter);
    }
    mounted() {
        this.Fetch(this.State.Filter);
    }
    applyFilter(filter) {
        this.Fetch(filter);
    }
    get selectedObjectType() {
        if (this.selectedObjectTypeIndex != null) {
            return this.State.Items[this.selectedObjectTypeIndex];
        }
        return null;
    }
    selectDic(id) {
        let index = this.State.Items.findIndex((value, index, obj) => {
            return value.Id === id;
        });
        this.selectedObjectTypeIndex = index;
        this.modalTitle = "Изменить сетевой адаптер";
        this.showCreateModal = true;
    }
    selectNext() {
        if (this.selectedObjectTypeIndex == null) {
            return;
        }
        if (this.selectedObjectTypeIndex >= this.State.Items.length - 1) {
            this.selectedObjectTypeIndex = 0;
        }
        else {
            this.selectedObjectTypeIndex += 1;
        }
    }
    selectPrev() {
        if (this.selectedObjectTypeIndex == null) {
            return;
        }
        if (this.selectedObjectTypeIndex <= 0) {
            this.selectedObjectTypeIndex = this.State.Items.length - 1;
        }
        else {
            this.selectedObjectTypeIndex -= 1;
        }
    }
    removeDic(dic) {
        bootbox.confirm({
            message: `Вы уверены что хотите удалить ${dic.Title}?`,
            animate: false,
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
                    this.Remove(dic.Id)
                        .then((result) => {
                        if (result.Success) {
                            this.Fetch(this.State.Filter);
                        }
                        else {
                            this.errorText = result.Message;
                            this.showError = true;
                            setTimeout(() => this.showError = false, 5000);
                        }
                    });
                }
            }
        });
    }
    onDicSaved(dic, closeModal) {
        this.Fetch(this.State.Filter);
        if (closeModal) {
            this.closeModal();
        }
    }
    onAddClick() {
        this.modalTitle = "Добавить сетевой адаптер";
        this.selectedObjectTypeIndex = null;
        this.showCreateModal = true;
    }
    closeModal() {
        this.showCreateModal = false;
    }
    closeFilterModal() {
        this.showFilterModal = false;
    }
    openFilterModal() {
        this.additionalFilter = Object.assign({}, this.State.Filter);
        this.showFilterModal = true;
    }
    applyAdditionalFilter(filter) {
        this.State.Filter.Title = filter.Title;
        this.State.Filter.Speed = filter.Speed;
        this.applyFilter(this.State.Filter);
        this.closeFilterModal();
    }
    getActions() {
        return [
            { Key: "", Value: "Действия" },
            { Key: "edit", Value: "Редактировать" },
            { Key: "delete", Value: "Удалить" }
        ];
    }
    selectorChange(value, dic) {
        switch (value) {
            case "edit":
                this.selectDic(dic.Id);
                break;
            case "delete":
                {
                    this.removeDic(dic);
                }
                break;
        }
        this.actionValue = "";
    }
    get tableFilterOptions() {
        return [
            {
                ForColumn: "Id",
                FieldName: "Id",
                Placeholder: "Id",
                Type: "text",
                CSSClass: "col-sm-1",
                Value: this.State.Filter ? this.State.Filter.Id : undefined
            },
            {
                ForColumn: "Title",
                FieldName: "Title",
                Placeholder: "Название",
                Type: "text",
                CSSClass: "col-sm-6",
                Value: this.State.Filter ? this.State.Filter.Title : undefined,
            },
            {
                ForColumn: "Speed",
                FieldName: "Speed",
                Placeholder: "Объем",
                Type: "text",
                CSSClass: "col-sm-4",
                Value: this.State.Filter ? this.State.Filter.Speed : undefined,
            }
        ];
    }
};
__decorate([
    Getter(Getters.NETWORK_ADAPTER_STATE, { namespace: namespace })
], NetworkAdapter.prototype, "State", void 0);
__decorate([
    Action(Actions.FETCH_NETWORK_ADAPTER, { namespace: namespace })
], NetworkAdapter.prototype, "Fetch", void 0);
__decorate([
    Action(Actions.REMOVE_NETWORK_ADAPTER, { namespace: namespace })
], NetworkAdapter.prototype, "Remove", void 0);
NetworkAdapter = __decorate([
    Component({
        components: {
            Datatable,
            Modal,
            EditForm,
            SearchFilter,
            select2
        }
    })
], NetworkAdapter);
export default NetworkAdapter;
//# sourceMappingURL=index.js.map