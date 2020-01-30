var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
let CreateProcessor = class CreateProcessor extends Vue {
    constructor() {
        super(...arguments);
        this.model = {
            Id: 0,
            Manufacturer: "",
            Product: ""
        };
        this.errorText = "";
    }
    store() {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result) => this.SaveHandler(result))
                    .catch(error => this.errorText = error);
            }
        });
    }
};
__decorate([
    Action(Actions.STORE_EQUIPMENT_PROCESSOR, { namespace: namespace })
], CreateProcessor.prototype, "storeImpl", void 0);
__decorate([
    Prop({ required: true })
], CreateProcessor.prototype, "SaveHandler", void 0);
__decorate([
    Getter(Getters.IS_SAVING, { namespace: namespace })
], CreateProcessor.prototype, "IsSaving", void 0);
CreateProcessor = __decorate([
    Component
], CreateProcessor);
export default CreateProcessor;
//# sourceMappingURL=CreateProcessor.js.map