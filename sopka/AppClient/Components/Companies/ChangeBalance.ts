import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { Getters, Actions, namespace } from "../../Store/Modules/Companies/constants";
import { ICompanyFilter, ICompaniesState, ICompanyListItem } from "../../Store/Modules/Companies/types";

@Component
export default class ChangeBalance extends Vue {

    @Prop({required: true})
    CompanyId: number;

    @Action(Actions.CHANGE_BALANCE, {namespace: namespace})
    ChangeBalance: ({ companyId, amount }: { companyId: number, amount: number }) => Promise<any>;

    private isSaved: boolean = false;
    private errorText: string = "";

    private Amount: number = 0;

    change() {
        this.$validator.validateAll().then((result) => {
            this.errorText = "";
            if (result) {
                this.ChangeBalance({ companyId: this.CompanyId, amount: this.Amount})
                    .then(() => {
                        this.isSaved = true;
                        this.$emit("onStore");
                    })
                    .catch((error) => {
                        this.errorText = error;
                        this.$emit("onStore");
                    });
            }
        });
    }

    cancel() {
        this.$emit("cancel");
    }
}