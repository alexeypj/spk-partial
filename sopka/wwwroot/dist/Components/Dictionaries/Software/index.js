var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Dictionaries/constants";
import Datatable from "../../../Shared/Datatable/Datatable.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import EditForm from "./EditForm.vue";
import SearchFilter from "./SearchFilter.vue";
import select2 from "../../../Shared/Select2/select2.vue";
let ObjectTypes = class ObjectTypes extends Vue {
    constructor() {
        super(...arguments);
        this.showCreateModal = false;
        this.showFilterModal = false;
        this.selectedObjectTypeIndex = null;
        this.modalTitle = "Добавить ПО";
        this.showError = false;
        this.errorText = "";
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Product", DisplayName: "Продукт" },
            { Name: "Manufacturer", DisplayName: "Производитель" }
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
        this.SetFilter(filter);
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
        this.modalTitle = "Изменить ПО";
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
            message: `Вы уверены что хотите удалить ${dic.Product}?`,
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
        this.modalTitle = "Добавить ПО";
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
        this.State.Filter.Product = filter.Product;
        this.State.Filter.Manufacturer = filter.Manufacturer;
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
                ForColumn: "Product",
                FieldName: "Product",
                Placeholder: "Продукт",
                Type: "text",
                CSSClass: "col-sm-5",
                Value: this.State.Filter ? this.State.Filter.Product : undefined,
            },
            {
                ForColumn: "Manufacturer",
                FieldName: "Manufacturer",
                Placeholder: "Производитель",
                Type: "text",
                CSSClass: "col-sm-5",
                Value: this.State.Filter ? this.State.Filter.Manufacturer : undefined,
            }
        ];
    }
};
__decorate([
    Getter(Getters.SOFTWARE_STATE, { namespace: namespace })
], ObjectTypes.prototype, "State", void 0);
__decorate([
    Action(Actions.FETCH_SOFTWARE, { namespace: namespace })
], ObjectTypes.prototype, "Fetch", void 0);
__decorate([
    Action(Actions.REMOVE_SOFTWARE, { namespace: namespace })
], ObjectTypes.prototype, "Remove", void 0);
__decorate([
    Mutation(Mutations.SET_SOFTWARE_FILTER, { namespace: namespace })
], ObjectTypes.prototype, "SetFilter", void 0);
ObjectTypes = __decorate([
    Component({
        components: {
            Datatable,
            Modal,
            EditForm,
            SearchFilter,
            select2
        }
    })
], ObjectTypes);
export default ObjectTypes;
//# sourceMappingURL=index.js.map