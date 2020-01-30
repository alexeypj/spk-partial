import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { urlHelper, logError } from "../../../Shared/utils";
import Axios from "axios";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";
import { Actions as commonActions, Getters as commonGetters, namespace as commonNamespace } from "../../../Store/Modules/Common/constants";
import { ISopkaSettings } from "../../../Store/Modules/Common/types";
import { ITariff } from "../../../Store/Modules/CompanyCard/types";

@Component({
    components: {
        select2,
    },
})
export default class Registration extends Vue {

    @Prop()
    tariff?: string;

    @Prop()
    usersCount?: number;

    @Prop()
    usersLimited?: boolean;

    @Prop()
    objectsLimited?: boolean;

    @Prop()
    support?: string;

    private tariffs: ITariff[] = [];
    private model = {
        AdminEmail: "",
        CompanyName: "",
        TariffId: null,
        PhoneNumber: "",
        FIO: "",
        Support: false,
        UsersCount: 1,
        UsersLimited: false,
        ObjectsLimited: true
    };
    private errorText: string = "";
    private successText: string = "";
    private isSaving = false;
    private selectedTariffId: number | null = null;

    @Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
    private FetchSettings: () => Promise<ISopkaSettings>;

    @Getter(commonGetters.SETTINGS, { namespace: commonNamespace })
    public readonly Settings: ISopkaSettings;

    mounted(): void {
        if (this.usersCount) {
            this.model.UsersCount = this.usersCount;
        }
        if (this.usersLimited) {
            this.model.UsersLimited = this.usersLimited;
        }
        if (this.objectsLimited) {
            this.model.ObjectsLimited = this.objectsLimited;
        }
        if (this.support === "true") {
            this.model.Support = true;
        }
        this.FetchSettings();
        this.loadTariffs();
    }

    get tariffsDic(): IDictionaryItem[] {
        return this.tariffs.map(x => {
            return {
                Key: x.Id,
                Value: x.Name
            }
        });
    }

    get isCloud(): boolean {
        let selectedTariff = this.tariffs.filter(x => x.Id == this.selectedTariffId)[0];
        if (selectedTariff) {
            return selectedTariff.IsCloud;
        }
        return false;
    }

    send() {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.isSaving = true;
                if (this.selectedTariffId) {
                    this.model.TariffId = <any>this.selectedTariffId;
                }
                Axios.post(urlHelper("Register", "Login"), this.model)
                    .then((result: any) => {
                        this.isSaving = false;
                        if (result.data.Success) {
                            this.successText = "Компания зарегистрирована. На почту отправлены данные для входа в систему.";
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

    loadTariffs(): void {
        Axios.get(urlHelper("List", "Tariffs"))
            .then((result) => {
                if (result.status === 200) {
                    if (typeof result.data === "string") {
                        logError(result.data);
                        return;
                    }
                    this.tariffs = result.data;
                    if (this.tariff) {
                        if (this.tariff === "cloud") {
                            this.selectedTariffId = this.tariffs.filter(x => x.IsCloud)[0].Id;
                        }
                        if (this.tariff === "local") {
                            this.selectedTariffId = this.tariffs.filter(x => !x.IsCloud)[0].Id;
                        }
                    }
                }
            })
            .catch((error) => {
                logError(error);
            });
    }
}