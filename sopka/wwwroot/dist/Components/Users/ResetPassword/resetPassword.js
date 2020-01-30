var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import { namespace, Actions } from "../../../Store/Modules/Users/constants";
import { User } from "../../../Store/Modules/Common/types";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.model = User.getDefault();
        this.errorText = "";
        this.isSaved = false;
        this.password = "";
    }
    mounted() {
        this.FetchUser(this.UserId).then((result) => {
            this.model = Object.assign({}, result);
            this.password = "";
        }).catch((error) => this.errorText = error);
    }
    store() {
        this.$validator.validateAll().then((result) => {
            this.errorText = "";
            if (result) {
                this.UpdatePassword({ userId: this.model.Id, password: this.password })
                    .then(() => {
                    this.isSaved = true;
                    this.$emit("onStore");
                })
                    .catch((error) => this.errorText = error);
            }
        });
    }
    cancel() {
        this.$emit("cancel");
    }
    generatePassword() {
        this.GeneratePasswordRequest().then((result) => this.password = result);
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "UserId", void 0);
__decorate([
    Action(Actions.FETCH_USER, { namespace })
], default_1.prototype, "FetchUser", void 0);
__decorate([
    Action(Actions.GENERATE_PASSWORD, { namespace })
], default_1.prototype, "GeneratePasswordRequest", void 0);
__decorate([
    Action(Actions.UPDATE_PASSWORD, { namespace })
], default_1.prototype, "UpdatePassword", void 0);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=resetPassword.js.map