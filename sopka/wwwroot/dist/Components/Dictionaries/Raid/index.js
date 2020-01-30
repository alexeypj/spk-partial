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
import Datatable from "../DictionaryDatatable.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import EditForm from "./EditForm.vue";
import SearchFilter from "./SearchFilter.vue";
let ObjectTypes = class ObjectTypes extends Vue {
    constructor() {
        super(...arguments);
        this.showCreateModal = false;
        this.showFilterModal = false;
        this.selectedObjectTypeIndex = null;
        this.modalTitle = "Добавить RAID";
        this.showError = false;
        this.errorText = "";
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Title", DisplayName: "Название" },
            { Name: "Description", DisplayName: "Описание" }
        ];
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
        this.modalTitle = "Изменить RAID";
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
        this.modalTitle = "Добавить RAID";
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
        this.State.Filter.Description = filter.Description;
        this.applyFilter(this.State.Filter);
        this.closeFilterModal();
    }
};
__decorate([
    Getter(Getters.RAID_STATE, { namespace: namespace })
], ObjectTypes.prototype, "State", void 0);
__decorate([
    Action(Actions.FETCH_RAID, { namespace: namespace })
], ObjectTypes.prototype, "Fetch", void 0);
__decorate([
    Action(Actions.REMOVE_RAID, { namespace: namespace })
], ObjectTypes.prototype, "Remove", void 0);
ObjectTypes = __decorate([
    Component({
        components: {
            Datatable,
            Modal,
            EditForm,
            SearchFilter
        }
    })
], ObjectTypes);
export default ObjectTypes;
//# sourceMappingURL=index.js.map