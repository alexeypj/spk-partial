import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
import { urlHelper } from "../../Shared/utils"

@Component
export default class AccessRecovery extends Vue {

    private email: string = "";
    private isSaving: boolean = false;
    private successText: string = "";
	private errorText: string = "";

    recover() {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.isSaving = true;
                axios.post(urlHelper("Restore", "Login"), { email: this.email })
                    .then((result: any) => {
                        this.isSaving = false;
                        if (result.data.Success) {
                            this.successText = "На почту отправлена ссылка для восстановления пароля";
                        } else {
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
}