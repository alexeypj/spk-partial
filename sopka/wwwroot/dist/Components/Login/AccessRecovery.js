var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import axios from "axios";
import { urlHelper } from "../../Shared/utils";
let AccessRecovery = class AccessRecovery extends Vue {
    constructor() {
        super(...arguments);
        this.email = "";
        this.isSaving = false;
        this.successText = "";
        this.errorText = "";
    }
    recover() {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.errorText = "";
                this.isSaving = true;
                axios.post(urlHelper("Restore", "Login"), { email: this.email })
                    .then((result) => {
                    this.isSaving = false;
                    if (result.data.Success) {
                        this.successText = "На почту отправлена ссылка для восстановления пароля";
                    }
                    else {
                        this.errorText = result.data.Message;
                    }
                })
                    .catch(error => {
                    this.errorText = error;
                    this.isSaving = false;
                });
            }
        });
    }
};
AccessRecovery = __decorate([
    Component
], AccessRecovery);
export default AccessRecovery;
//# sourceMappingURL=AccessRecovery.js.map