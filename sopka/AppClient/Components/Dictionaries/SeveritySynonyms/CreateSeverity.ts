import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IIncidentCriticality } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";

@Component
export default class CreateHDD extends Vue {

    @Action(Actions.STORE_SEVERITY, { namespace: namespace })
    storeImpl: (model: { Title: string }) => Promise<IDictionaryItem>;

    @Prop({ required: true })
    SaveHandler: (result: IDictionaryItem) => void;

    @Getter(Getters.IS_SAVING, { namespace: namespace })
    IsSaving: boolean;


    private model: { Title: string } = {
        Title: ""
    };

    private errorText: string = "";

    resetModel() {
        this.model.Title = "";
        this.errorText = "";
    }

    public store(): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: IDictionaryItem) => {
                        this.SaveHandler(result);
                        this.resetModel();
                        this.$validator.reset();
                    })
                    .catch(error => this.errorText = error);
            }
        });
    }

    close() {
        this.resetModel();
        this.$validator.reset();
        this.$emit('cancel', true);
    }
}