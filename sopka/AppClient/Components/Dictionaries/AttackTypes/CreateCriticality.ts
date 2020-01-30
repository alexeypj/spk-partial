import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IIncidentCriticality } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";

@Component
export default class CreateHDD extends Vue {

    @Action(Actions.STORE_INCIDENT_CRITICALITY, { namespace: namespace })
    storeImpl: (model: IIncidentCriticality) => Promise<IIncidentCriticality>;

    @Prop({ required: true })
    SaveHandler: (result: IIncidentCriticality) => void;

    @Getter(Getters.IS_SAVING, { namespace: namespace })
    IsSaving: boolean;

    private model: IIncidentCriticality = {
        Id: 0,
        Criticality: ""
    };

    private errorText: string = "";

    resetModel() {
        this.model.Id = 0;
        this.model.Criticality = "";
        this.errorText = "";
    }

    public store(): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: IIncidentCriticality) => {
                        this.SaveHandler(result);
                        this.resetModel();
                    })
                    .catch(error => this.errorText = error);
            }
        });
    }

    close() {
        this.resetModel();
        this.$emit('cancel', true);
    }
}