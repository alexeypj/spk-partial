var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";
let CreateType = class CreateType extends Vue {
    constructor() {
        super(...arguments);
        this.model = {
            Id: 0,
            Product: "",
            Manufacturer: ""
        };
        this.errorText = "";
    }
    onSelectedObjectTypeChanged(val, oldVal) {
        if (val) {
            this.model.Id = val.Id;
            this.model.Product = val.Product;
            this.model.Manufacturer = val.Manufacturer;
        }
        else {
            this.resetModel();
        }
    }
    created() {
        this.resetModel();
    }
    get Model() {
        return this.model;
    }
    resetModel() {
        this.model.Id = 0;
        this.model.Product = "";
        this.model.Manufacturer = "";
    }
    storeAndExit() {
        this.store(true);
    }
    store(closeModal = false) {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result) => {
                    if (closeModal) {
                        this.resetModel();
                    }
                    if (this.SaveHandler) {
                        this.SaveHandler(result, closeModal);
                    }
                })
                    .catch(error => this.errorText = error);
            }
        });
    }
    selectNext() {
        if (this.hasChanges()) {
            this.showDropChangesConfirmation(() => {
                this.OnSelectNext();
            });
        }
        else {
            this.OnSelectNext();
        }
    }
    selectPrev() {
        if (this.hasChanges()) {
            this.showDropChangesConfirmation(() => {
                this.OnSelectPrev();
            });
        }
        else {
            this.OnSelectPrev();
        }
    }
    hasChanges() {
        if (!this.SelectedObjectType) {
            return false;
        }
        if (this.model.Id > 0) {
            if (this.model.Manufacturer !== this.SelectedObjectType.Manufacturer ||
                this.model.Product !== this.SelectedObjectType.Product) {
                return true;
            }
        }
        else {
            if (this.model.Manufacturer || this.model.Product) {
                return true;
            }
        }
        return false;
    }
    showDropChangesConfirmation(confirmCallback) {
        bootbox.confirm({
            message: "Внесенные изменения будут потеряны. Продолжить?",
            animate: false,
            buttons: {
                confirm: {
                    label: "Да",
                    className: "btn-success"
                },
                cancel: {
                    label: "Отмена",
                    className: "btn-white"
                },
            },
            callback: (result) => {
                if (result) {
                    confirmCallback();
                }
            }
        });
    }
};
__decorate([
    Action(Actions.STORE_EQUIPMENT_SOFTWARE, { namespace: namespace })
], CreateType.prototype, "storeImpl", void 0);
__decorate([
    Prop({ required: true })
], CreateType.prototype, "SaveHandler", void 0);
__decorate([
    Prop({ required: false })
], CreateType.prototype, "SelectedObjectType", void 0);
__decorate([
    Prop({ required: true })
], CreateType.prototype, "OnSelectNext", void 0);
__decorate([
    Prop({ required: true })
], CreateType.prototype, "OnSelectPrev", void 0);
__decorate([
    Getter(Getters.IS_SAVING, { namespace: namespace })
], CreateType.prototype, "IsSaving", void 0);
__decorate([
    Watch('SelectedObjectType', { immediate: true })
], CreateType.prototype, "onSelectedObjectTypeChanged", null);
CreateType = __decorate([
    Component
], CreateType);
export default CreateType;
//# sourceMappingURL=EditForm.js.map