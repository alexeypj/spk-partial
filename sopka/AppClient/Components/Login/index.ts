import Vue from "vue";
import { Component } from "vue-property-decorator";
import Axios from "axios";
import { urlHelper } from "../../Shared/utils";
import VeeValidate, { Validator, Configuration } from "vee-validate";
import RuLocalization  from "vee-validate/dist/locale/ru.js";
import Modal from "../../Shared/Modals/modal.vue";
import AccessRecovery from "./AccessRecovery.vue"
import Support from "./Support.vue"
import Registration from "./Registration/index.vue"
import { ISopkaSettings } from "../../Store/Modules/Common/types";
import { Actions as commonActions, Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import { Action, Getter } from "vuex-class";

interface ILoginModel {
    Email: string;
    Password: string;
}

Validator.localize("ru", RuLocalization);
const validatorConfig: Object = { locale: "ru", fieldsBagName: "formFields" };
Vue.use<Configuration>(VeeValidate, validatorConfig);

@Component({
    components: {
        AccessRecovery,
        Modal,
        Support,
    }
})
export default class Login extends Vue {
    model: ILoginModel = {
        Email: "",
        Password: ""
    }

    @Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
    private FetchSettings: () => Promise<ISopkaSettings>;

    @Getter(commonGetters.SETTINGS, { namespace: commonNamespace })
    public readonly Settings: ISopkaSettings;
   


	private errorText: string = "";
    private showRestoreModal = false;
    private showSupportModal = false;
    private showRegistrationModal = false;
    private isSaving = false;

    public restore() {
        this.showRestoreModal = true;
    }

    public openSupportModal() {
        this.showSupportModal = true;
    }

    public closeRestoreModal() {
        this.showRestoreModal = false;
    }

    public closeSupportModal() {
        this.showSupportModal = false;
    }

   

    public mounted(): void {
        this.FetchSettings();
        
    }

    public onSubmit(e): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.isSaving = true;
                Axios(urlHelper("SignIn", "Login"),
                        {
                            method: "post",
                            data: this.model
                        })
                    .then(result => {
                        this.isSaving = false;
                        if (result.data.Success) {
                            window.location.href = window.baseUrl;
                        } else {
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
}

