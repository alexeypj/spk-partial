import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { urlHelper } from "../../Shared/utils";
import axios from "axios";

@Component
export default class Support extends Vue {
    private email: string = "";
    private text: string = "";
    private isSaving: boolean = false;
    private errorText: string = "";
    private successText: string =  "";

    send() {
        var token = this.$route.query.token;
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.isSaving = true;
                axios(urlHelper("Support", "Login"),
                        {
                            method: "post",
                            data: {
                                email: this.email,
                                text: this.text,
                            }
                        })
                    .then(result => {
                        this.isSaving = false;
                        if (result.data.Success) {
                            this.successText = "Сообщение отправлено";
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
