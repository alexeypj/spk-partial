import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import { Actions, namespace } from "../../Store/Modules/Companies/constants";
import { ICompanyEditModel } from "../../Store/Modules/Companies/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";
import select2 from "Shared/Select2/select2.vue";

@Component({
    components: {
        select2
    }
})
export default class EditForm extends Vue {

    @Prop({required: true})
    Company: ICompanyEditModel;

    @Action(Actions.STORE_COMPANY, {namespace})
    Store: (company: ICompanyEditModel) => Promise<void>;

    private model: ICompanyEditModel = {
        Id: 0,
        Name: "",
        Comment: "",
        EquipmentsCount: 0,
        UsersCount: 0,
        ObjectsCount: 0,
        ResponsiblePersonEmail: "",
        Support: true
    };

    mounted() {
        this.model = { ...this.Company };
    }

    get usersCountOptions(): IDictionaryItem[] {
        let items = [
            { Key: 50, Value: "50" },
            { Key: 100, Value: "100" },
            { Key: 0, Value: "Безлимит" },
        ];
        if (!items.find(x => x.Key == this.model.UsersCount)) {
            items.push({ Key: this.model.UsersCount, Value: this.model.UsersCount.toString() });
        }
        return items;
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


    private isSaved: boolean = false;
    private errorText: string = "";

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