var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { urlHelper } from "../../Shared/utils";
import axios from "axios";
import { Getter, Action } from "vuex-class";
import { Getters, namespace, Actions } from "../../Store/Modules/Common/constants";
let ResetPassword = class ResetPassword extends Vue {
    constructor() {
        super(...arguments);
        this.email = "";
        this.newPassword = "";
        this.confirmNewPassword = "";
        this.errorText = "";
    }
    mounted() {
        this.FetchSettings();
    }
    reset() {
        var token = this.$route.query.token;
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.errorText = "";
                axios(urlHelper("ResetPassword", "Login"), {
                    method: "post",
                    data: {
                        email: this.email,
                        newPassword: this.newPassword,
                        confirmNewPassword: this.confirmNewPassword,
                        token: token
                    }
                })
                    .then(result => {
                    if (result.data.Success) {
                        window.location.href = window.baseUrl;
                    }
                    else {
                        this.errorText = result.data.Message;
                    }
                });
            }
        });
    }
};
__decorate([
    Action(Actions.FETCH_SETTINGS, { namespace })
], ResetPassword.prototype, "FetchSettings", void 0);
__decorate([
    Getter(Getters.SETTINGS, { namespace })
], ResetPassword.prototype, "Settings", void 0);
ResetPassword = __decorate([
    Component
], ResetPassword);
export default ResetPassword;
//# sourceMappingURL=ResetPassword.js.map