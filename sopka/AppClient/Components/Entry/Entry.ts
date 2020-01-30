import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace } from "../../Store/Modules/Common/constants";
import { Action, Getter } from "vuex-class";
import { Getters } from "../../Store/Modules/Common/constants";
import { IUser, Roles } from "../../Store/Modules/Common/types";
import { isUserInRole } from "../../Shared/utils";
import { ISopkaSettings } from "../../Store/Modules/Common/types";
import { Actions as commonActions, Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import SignalRHelper from "../../Shared/SignalR/signalrhelper";
import Admin = Roles.Admin;

@Component
export default class extends Vue {

    path: string = '/Incident';

    @Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
    private FetchSettings: () => Promise<ISopkaSettings>;

    @Getter(Getters.SETTINGS, { namespace  })
    public readonly Settings: ISopkaSettings;

    @Getter(Getters.IS_ADMIN, { namespace })
    public readonly IsAdmin: boolean;

    @Getter(Getters.IS_COMPANY_ADMIN, { namespace })
    public readonly IsCompanyAdmin: boolean;

    @Getter(Getters.IS_AUTHENTICATED, { namespace })
    public readonly IsAuthenticated: boolean;

    @Getter(Getters.ASSEMBLY, { namespace })
    public readonly Assembly: string;

    @Getter(Getters.CURRENT_USER, { namespace })
    public readonly CurrentUser: IUser;

    @Watch('$route', { immediate: true, deep: true })
    onUrlChange(newVal: any) {
       this.path = this.$route.path;
    }

    public mounted(): void {
        this.FetchSettings();
        if (this.CurrentUser && this.CurrentUser.IsAuthenticated) {
            SignalRHelper.connect();

            /// MessengerExample

            SignalRHelper.subscribe("Messenger", ({method, payload, connectionId}) => {
                if (this.Settings.IsDebug) {
                    console.log("Method", method);
                    console.log("Payload", payload);
                    console.log("ConnectionId", connectionId);
                    console.log("Is my connection", SignalRHelper.isMyConnection(connectionId));
                }
            });

            setTimeout(() => {
                SignalRHelper.unsubscribe("Messenger");
            }, 5000);
        }
    }

    get DisplayEquipments(): boolean {
        return true;
    }

    get DisplayInventories(): boolean {
        return true;
    }

    get DisplayIncidents(): boolean {
        return true;
    }

    get DisplayPost(): boolean {
        return this.Settings.IsLimited === false;
    }

    get DisplayMessages(): boolean {
        return this.Settings.IsLimited === false;
    }

    get DisplayVulnerabilities(): boolean {
        return this.Settings.IsLimited === false;
    }

    get DisplayUsers(): boolean {
        return this.Settings.IsLimited === false &&
            (isUserInRole(this.CurrentUser, Roles.Admin) || isUserInRole(this.CurrentUser, Roles.CompanyAdmin));
    }

    get DisplayKnowledgeBase(): boolean {
        return true;
    }

    get DisplayDictionaries(): boolean {
        if (this.CurrentUser.CompanyId) {
          return false;
        }
        return true;
    }

    get DisplayCompanies(): boolean {
        if (this.CurrentUser.CompanyId) {
          return false;
        }
        return true;
    }

    get DisplayCompanyCard(): boolean {
        if (!this.CurrentUser.CompanyId) {
          return false;
        }
        return isUserInRole(this.CurrentUser, Roles.CompanyAdmin);
    }

    get DisplayEquipmentLogs(): boolean {
        return this.Settings.IsLimited === false;
    }

    get DisplayLogAction(): boolean {
        return isUserInRole(this.CurrentUser, Roles.Admin) || isUserInRole(this.CurrentUser, Roles.CompanyAdmin);
    }

    get DisplayTariffs(): boolean {
        if (this.CurrentUser.CompanyId) {
          return false;
        }
        return isUserInRole(this.CurrentUser, Admin);
    }
}
