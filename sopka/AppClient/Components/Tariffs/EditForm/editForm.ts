import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { Getters, Mutations, Actions, namespace } from "../../../Store/Modules/Tariffs/constants";
import { ITariff } from "../../../Store/Modules/Tariffs/types";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";

@Component({
    components: {
        select2,
    }
})
export default class TariffEditForm extends Vue {

    @Action(Actions.STORE_TARIFF, { namespace})
    Store: (tariff: ITariff) => Promise<void>;

    @Prop({required: true})
    TariffId: number | null;

    @Getter(Getters.TARIFF_BY_ID, {namespace})
    GetSelectedTariff: (tariffId: number) => ITariff;

    private model: ITariff = {
        EquipmentsCount: 0,
        IsActive: true,
        Support: true,
        ObjectsCount: 0,
        UsersCount: 0,
        IsCloud: true,
        Name: "",
        Period: 30,
        Id: 0
    }

    mounted() {
        if (this.TariffId) {
            this.model = { ...this.GetSelectedTariff(this.TariffId) };
        }
    }

    get usersCountOptions(): IDictionaryItem[] {
        return [
            { Key: 50, Value: "50"},
            { Key: 100, Value: "100" },
            { Key: 0, Value: "Безлимит" },
        ];
    }

    get objectsCountOptions(): IDictionaryItem[] {
        return [
            { Key: 100, Value: "100" },
            { Key: 500, Value: "500" },
            { Key: 0, Value: "Безлимит" },
        ];
    }

    get equipmentsCountOptions(): IDictionaryItem[] {
        return this.objectsCountOptions;
    }

    private errorText: string = "";
    private isSaved: boolean = false;

    store() {
        this.$validator.validateAll().then((result) => {
            this.errorText = "";
            if (result) {
                this.Store(this.model)
                    .then(() => {
                        this.isSaved = true;
                        this.$emit("onStore");
                    })
                    .catch((error) => this.errorText = error);
            }
        });
    }

    cancel() {
        this.$emit("cancel");
    }
}