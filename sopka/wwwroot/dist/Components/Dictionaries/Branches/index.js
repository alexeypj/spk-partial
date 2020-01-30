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
let Branches = class Branches extends Vue {
    constructor() {
        super(...arguments);
        this.showCreateModal = false;
        this.showFilterModal = false;
        //selectedObjectType: IAttackTypeDirectory | null = null;
        this.selectedObjectTypeIndex = null;
        this.modalTitle = "Добавить филиал";
        this.showError = false;
        this.errorText = "";
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Title", DisplayName: "Название" },
            { Name: "Description", DisplayName: "Описание" }
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
        this.modalTitle = "Изменить филиал";
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
            message: `Вы уверены что хотите удалить филиал ${dic.Title}?`,
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
        this.modalTitle = "Добавить филиал";
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
                CSSClass: "col-sm-4",
                Value: this.State.Filter ? this.State.Filter.Title : undefined,
            },
            {
                ForColumn: "Description",
                FieldName: "Description",
                Placeholder: "Описание",
                Type: "text",
                CSSClass: "col-sm-6",
                Value: this.State.Filter ? this.State.Filter.Description : undefined,
            }
        ];
    }
};
__decorate([
    Getter(Getters.BRANCHES_STATE, { namespace: namespace })
], Branches.prototype, "State", void 0);
__decorate([
    Action(Actions.FETCH_BRANCHES_DIRECTORY, { namespace: namespace })
], Branches.prototype, "Fetch", void 0);
__decorate([
    Action(Actions.REMOVE_BRANCH, { namespace: namespace })
], Branches.prototype, "Remove", void 0);
__decorate([
    Mutation(Mutations.SET_BRANCHES_FILTER, { namespace: namespace })
], Branches.prototype, "SetFilter", void 0);
Branches = __decorate([
    Component({
        components: {
            Datatable,
            Modal,
            EditForm,
            SearchFilter,
            select2
        }
    })
], Branches);
export default Branches;
//# sourceMappingURL=index.js.map