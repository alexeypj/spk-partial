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
let Support = class Support extends Vue {
    constructor() {
        super(...arguments);
        this.email = "";
        this.text = "";
        this.isSaving = false;
        this.errorText = "";
        this.successText = "";
    }
    send() {
        var token = this.$route.query.token;
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.errorText = "";
                this.isSaving = true;
                axios(urlHelper("Support", "Login"), {
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
Support = __decorate([
    Component
], Support);
export default Support;
//# sourceMappingURL=Support.js.map