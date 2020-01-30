var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { hasChanges } from "../../../Store/Modules/Inventory/types";
import { Getter, Action } from "vuex-class";
import { Actions, Getters, namespace } from "../../../Store/Modules/Inventory/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import { losingChangesConfirmation } from "../../../Store/Modules/Common/constants";
let ObjectDetails = class ObjectDetails extends Vue {
    constructor() {
        super(...arguments);
        this.model = {};
        this.errorText = "";
        this.isSaved = false;
    }
    onAddressChange(newVal) {
        if (newVal.Address) {
            this.model.ObjectAddress = newVal.Address;
        }
        this.model.Latitude = newVal.Latitude;
        this.model.Longitude = newVal.Longitude;
    }
    mounted() {
        this.FetchDictionaries().then(() => this.model = Object.assign({}, this.SelectedObject));
        if (this.SelectedId) {
            this.FetchObject(this.SelectedId);
        }
        this.$parent.$on("store", () => this.store());
        this.$parent.$on("remove", () => this.remove());
        this.unsubscribe = this.$store.watch(() => this.$store.getters[namespace + "/" + Getters.SELECTED_OBJECT], () => {
            this.model = Object.assign({}, this.SelectedObject);
            this.$nextTick(() => this.$validator.reset());
        });
        window.addEventListener("beforeunload", this.onHasChanges);
    }
    beforeDestroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.$parent.$off("store");
        this.$parent.$off("remove");
        window.removeEventListener("beforeunload", this.onHasChanges);
    }
    onHasChanges(event) {
        if (hasChanges(this.model, this.SelectedObject)) {
            event.preventDefault();
            event.returnValue = false;
            return losingChangesConfirmation;
        }
        return;
    }
    get isNew() {
        return !this.SelectedObject.Id || (this.SelectedObject && this.SelectedObject.Id === 0);
    }
    mapSearch() {
        this.$emit("mapSearch", this.model.ObjectAddress);
    }
    checkCoordinates() {
        if (this.model.Latitude && this.model.Longitude) {
            this.$emit("changedCoordinates", this.model.Latitude, this.model.Longitude);
        }
    }
    get branchName() {
        if (this.model.IdBranch) {
            const result = this.Branches.find(x => x.Key === this.model.IdBranch);
            if (result) {
                return result.Value;
            }
        }
        return "";
    }
    get typeName() {
        if (this.model.IdType) {
            const result = this.ObjectTypes.find(x => x.Key === this.model.IdType);
            if (result) {
                return result.Value;
            }
        }
        return "";
    }
    store() {
        this.$validator.validateAll().then((valid) => {
            if (valid) {
                this.StoreObject(this.model)
                    .then((result) => {
                    this.errorText = "";
                    const objResult = result;
                    if (objResult.Id) {
                        this.isSaved = true;
                        this.$emit("onStore", objResult.Id);
                        setTimeout(() => this.isSaved = false, 5000);
                    }
                }).catch((error) => this.errorText = error);
            }
        });
    }
    CopyF(idinp) {
        $("#" + idinp).select();
        document.execCommand("copy");
    }
    remove() {
        bootbox.confirm({ message: `Вы уверены что хотите удалить объект <strong>${this.model.ObjectName}</strong>?`,
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
                    this.RemoveObject(this.model.Id)
                        .then((success) => {
                        if (success) {
                            this.$emit("refreshList");
                        }
                    })
                        .catch((error) => this.errorText = error);
                }
            }
        });
    }
};
__decorate([
    Getter(Getters.SELECTED_OBJECT, { namespace })
], ObjectDetails.prototype, "SelectedObject", void 0);
__decorate([
    Getter(Getters.SELECTED_ID, { namespace })
], ObjectDetails.prototype, "SelectedId", void 0);
__decorate([
    Action(Actions.FETCH_OBJECT_DICTIONARIES, { namespace })
], ObjectDetails.prototype, "FetchDictionaries", void 0);
__decorate([
    Getter(Getters.DICTIONARY_BRANCH, { namespace })
], ObjectDetails.prototype, "Branches", void 0);
__decorate([
    Getter(Getters.DICTIONARY_OBJECT_TYPES, { namespace })
], ObjectDetails.prototype, "ObjectTypes", void 0);
__decorate([
    Action(Actions.FETCH_OBJECT, { namespace })
], ObjectDetails.prototype, "FetchObject", void 0);
__decorate([
    Action(Actions.REMOVE_OBJECT, { namespace })
], ObjectDetails.prototype, "RemoveObject", void 0);
__decorate([
    Action(Actions.STORE_OBJECT, { namespace })
], ObjectDetails.prototype, "StoreObject", void 0);
__decorate([
    Prop()
], ObjectDetails.prototype, "address", void 0);
__decorate([
    Prop({ default: true })
], ObjectDetails.prototype, "IsReadonly", void 0);
__decorate([
    Watch("address")
], ObjectDetails.prototype, "onAddressChange", null);
ObjectDetails = __decorate([
    Component({
        components: {
            select2
        }
    })
], ObjectDetails);
export default ObjectDetails;
//# sourceMappingURL=ObjectDetails.js.map