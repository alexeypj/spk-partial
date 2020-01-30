import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { Getters, Actions, namespace } from "../../Store/Modules/CompanyCard/constants";
import { ICompanyCardState, ICompanyCard, ITariff, ICompany } from "../../Store/Modules/CompanyCard/types";
import ChangeTariff from "./ChangeTariff.vue";
import Modal from "../../Shared/Modals/modal.vue";

@Component({
    components: {
        ChangeTariff,
        Modal
    }
})
export default class CompanyCard extends Vue {
    
    @Action(Actions.FETCH_COMPANY_INFO, {namespace})
    FetchCompanyInfo: () => Promise<ICompanyCard>;

    @Action(Actions.FETCH_TARIFFS, {namespace})
    FetchTariffs: () => Promise<ITariff[]>;

    @Action(Actions.STORE_COMPANY_INFO, {namespace})
    StoreCompanyInfo: (companyInfo: ICompany) => Promise<any>;

    @Getter(Getters.COMPANY_INFO, {namespace})
    CompanyCard: ICompanyCard | null;

    @Getter(Getters.TARIFFS, {namespace})
    Tariffs: ITariff[];


    private model: ICompany | null = null;
    private readonly: boolean = true;
    private isSaving: boolean = false;
    private isSaved: boolean = false;
    private errorText: string = "";
    private showChangeTariffForm: boolean = false;

    mounted(): void {
        this.loadCompanyInfo();
        this.FetchTariffs();
    }

    loadCompanyInfo(): void {
        this.FetchCompanyInfo()
            .then(x => {
                this.model = { ...x.CompanyInfo };
            });
    }

    edit() {
        this.readonly = false;
        this.isSaved = false;
        this.errorText = "";
    }

    cancel() {
        if (this.CompanyCard) {
            this.model = { ...this.CompanyCard.CompanyInfo };
        }
        this.readonly = true;
        this.isSaved = false;
        this.errorText = "";
    }

    store() {
        this.$validator.validateAll().then((valid) => {
            if (valid && this.model) {
                this.isSaving = true;
                this.StoreCompanyInfo(this.model)
                    .then(() => {
                        this.readonly = true;
                        this.isSaving = false;
                        this.isSaved = true;
                        this.loadCompanyInfo();
                    })
                    .catch(error => {
                        this.errorText = error;
                        this.isSaving = false;
                    });
            }
        });
    }

    get currentTariff(): ITariff | null {
        if (this.CompanyCard != null) {
            return this.Tariffs.filter(x => x.Id === this.CompanyCard!.CompanyInfo.TariffId)[0] || null;
        }
        return null;
    }
}