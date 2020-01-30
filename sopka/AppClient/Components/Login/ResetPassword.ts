import Vue from "vue";
import { Component } from "vue-property-decorator";
import { urlHelper } from "../../Shared/utils";
import axios from "axios";
import { Getter, Action } from "vuex-class";
import { Getters, namespace, Actions } from "../../Store/Modules/Common/constants";
import { ISopkaSettings } from "../../Store/Modules/Common/types";

@Component
export default class ResetPassword extends Vue {

    @Action(Actions.FETCH_SETTINGS, { namespace  })
    private FetchSettings: () => Promise<ISopkaSettings>;

    @Getter(Getters.SETTINGS, { namespace })
    public readonly Settings: ISopkaSettings;

    private email: string = "";
    private newPassword: string = "";
    private confirmNewPassword: string = "";
    private errorText: string = "";

    public mounted(): void {
        this.FetchSettings();
    }

    reset(): void {
        var token = this.$route.query.token;
        this.$validator.validateAll().then((result: boolean) => {
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
                        } else {
                            this.errorText = result.data.Message;
                        }
                    });
            }
        });
    }


}
