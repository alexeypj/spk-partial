import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import { namespace, Actions } from "../../../Store/Modules/Users/constants";
import { IUser, User  } from "../../../Store/Modules/Common/types";

@Component
export default class extends Vue {

    @Prop({ required: true})
    public UserId: string;

    @Action(Actions.FETCH_USER, { namespace })
    public FetchUser: (id: string) => Promise<IUser>;

    @Action(Actions.GENERATE_PASSWORD, { namespace })
    public GeneratePasswordRequest: () => Promise<string>;

    @Action(Actions.UPDATE_PASSWORD, { namespace })
    public UpdatePassword: ({userId, password}: { userId: string, password: string}) => Promise<boolean>;

    private model: IUser = User.getDefault();
    private errorText: string = "";
    private isSaved: boolean = false;
    private password: string = "";

    public mounted(): void {
        this.FetchUser(this.UserId).then((result: IUser) => {
            this.model = { ...result };
            this.password = "";
        }).catch((error) => this.errorText = error);
    }

    public store(): void {
        this.$validator.validateAll().then((result) => {
            this.errorText = "";
            if (result) {
                this.UpdatePassword({ userId: this.model.Id, password: this.password })
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

    public generatePassword(): void {
        this.GeneratePasswordRequest().then((result: string) => this.password = result);
    }
}
