import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { Getters, Actions, namespace } from "../../Store/Modules/CompanyCard/constants";
import { ICompanyCardState, ICompanyCard, ITariff } from "../../Store/Modules/CompanyCard/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";
import select2 from "../../Shared/Select2/select2.vue";

@Component({
    components: {
        select2
    }
})
export default class ChangeTariff extends Vue {

    @Action(Actions.CHANGE_TARIFF, {namespace: namespace})
    ChangeTariff: ({ tariffId }: { tariffId: number }) => Promise<any>;

    @Getter(Getters.TARIFFS, {namespace})
    Tariffs: ITariff[];

    private isSaved: boolean = false;
    private errorText: string = "";
    private selectedTariffId: number | null = null;

    get tariffs(): IDictionaryItem[] {
        return this.Tariffs.map(x => {
            return {
                Key: x.Id,
                Value: x.Name
            }
        });
    }

    change() {
        this.$validator.validateAll().then((result) => {
            this.errorText = "";
            if (result) {
                this.ChangeTariff({ tariffId: this.selectedTariffId!})
                    .then(result => {
                        if (result.Success) {
                            this.isSaved = true;
                            this.$emit("onChange");
                        } else {
                            this.errorText = result.Message;
                        }
                    })
                    .catch((error) => this.errorText = error);
            }
        });
    }

    cancel() {
        this.$emit("cancel");
    }
}