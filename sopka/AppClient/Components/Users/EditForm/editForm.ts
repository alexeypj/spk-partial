import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IUser, User, IUserRole } from "../../../Store/Modules/Common/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Users/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";

@Component({
    components: {
        select2
    }
})
export default class extends Vue {

    @Prop({ required: true})
    public UserId: string;

    @Action(Actions.FETCH_USER, { namespace })
    public FetchUser: (id: string) => Promise<IUser>;

    @Action(Actions.STORE_USER, { namespace })
    public Store: ({user, roles}: { user: IUser, roles: string[]}) => Promise<IUser|string>;

    @Getter(Getters.ROLES, { namespace })
    public readonly Roles: IUserRole[];

    private model: IUser = User.getDefault();

    private errorText: string = "";
    private isSaved: boolean = false;
    private roleId: string = "";

    public mounted(): void {
        this.FetchUser(this.UserId).then((result: IUser) => {
            this.model = { ...result };
            this.roleId = "";
            if (result.UserRoles && result.UserRoles.length > 0) {
                this.roleId = result.UserRoles[0].RoleId;
            }
        }).catch((error) => this.errorText = error);
    }

    public store(): void {
        this.$validator.validateAll().then((result) => {
            this.errorText = "";
            if (result) {
                this.Store({ user: this.model, roles: [this.roleId] })
                    .then(() => {
                        this.isSaved = true;
                        this.$emit("onStore");
                    })
                    .catch((error) => this.errorText = error);
            }
        });
    }

    public cancel(): void {
        this.$emit("cancel");
    }

    public get rolesDict(): IDictionaryItem[] {
        return this.Roles.map(x => <IDictionaryItem> { Key: x.Id, Value: x.Name });
    }

}
