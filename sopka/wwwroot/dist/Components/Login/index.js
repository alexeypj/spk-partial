var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Axios from "axios";
import { urlHelper } from "../../Shared/utils";
import VeeValidate, { Validator } from "vee-validate";
import RuLocalization from "vee-validate/dist/locale/ru.js";
import Modal from "../../Shared/Modals/modal.vue";
import AccessRecovery from "./AccessRecovery.vue";
import Support from "./Support.vue";
import { Actions as commonActions, Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import { Action, Getter } from "vuex-class";
Validator.localize("ru", RuLocalization);
const validatorConfig = { locale: "ru", fieldsBagName: "formFields" };
Vue.use(VeeValidate, validatorConfig);
let Login = class Login extends Vue {
    constructor() {
        super(...arguments);
        this.model = {
            Email: "",
            Password: ""
        };
        this.errorText = "";
        this.showRestoreModal = false;
        this.showSupportModal = false;
        this.isSaving = false;
    }
    restore() {
        this.showRestoreModal = true;
    }
    openSupportModal() {
        this.showSupportModal = true;
    }
    closeRestoreModal() {
        this.showRestoreModal = false;
    }
    closeSupportModal() {
        this.showSupportModal = false;
    }
    mounted() {
        this.FetchSettings();
    }
    onSubmit(e) {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.errorText = "";
                this.isSaving = true;
                Axios(urlHelper("SignIn", "Login"), {
                    method: "post",
                    data: this.model
                })
                    .then(result => {
                    this.isSaving = false;
                    if (result.data.Success) {
                        window.location.href = window.baseUrl;
                    }
                    else {
                        this.errorText = result.data.Message;
                    }
                })
                    .catch(error => {
                    this.isSaving = false;
                    this.errorText = error;
                });
            }
        });
    }
};
__decorate([
    Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
], Login.prototype, "FetchSettings", void 0);
__decorate([
    Getter(commonGetters.SETTINGS, { namespace: commonNamespace })
], Login.prototype, "Settings", void 0);
Login = __decorate([
    Component({
        components: {
            AccessRecovery,
            Modal,
            Support
        }
    })
], Login);
export default Login;
//# sourceMappingURL=index.js.map