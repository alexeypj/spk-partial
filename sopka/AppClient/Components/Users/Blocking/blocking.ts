import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import { namespace, Actions } from "../../../Store/Modules/Users/constants";
import { IUser, User  } from "../../../Store/Modules/Common/types";
import { formatDate } from "../../../Shared/utils";

@Component
export default class extends Vue {

    @Prop({ required: true})
    public UserId: string;

    @Prop({ default: false })
    public ViewOnly: boolean;

    @Action(Actions.FETCH_USER, { namespace })
    public FetchUser: (id: string) => Promise<IUser>;

    @Action(Actions.BLOCK_USER, { namespace })
    public BlockUser: ({userId, reason}: {userId: string, reason: string}) => Promise<boolean>;

    @Action(Actions.UNBLOCK_USER, { namespace })
    public UnblockUser: (userId: string) => Promise<boolean>;

    private model: IUser = User.getDefault();
    private errorText: string = "";
    private isSaved: boolean = false;
    private blockReason: string = "";

    public mounted(): void {
        this.FetchUser(this.UserId).then((result: IUser) => {
            this.model = { ...result };
            this.blockReason = "";
        }).catch((error) => this.errorText = error);
    }

    public store(): void {
        this.$validator.validateAll().then((result) => {
            this.errorText = "";
            if (result) {
                if (this.model.IsBlock) {
                    this.UnblockUser(this.model.Id)
                        .then(() => {
                            this.isSaved = true;
                            this.$emit("onStore");
                        })
                        .catch((error) => this.errorText = error);
                } else {
                    this.BlockUser({ userId: this.model.Id, reason: this.blockReason })
                        .then(() => {
                            this.isSaved = true;
                            this.$emit("onStore");
                        })
                        .catch((error) => this.errorText = error);
                }
            }
        });
    }

    public get blockDate(): string {
        if (this.model.BlockDate) {
            return formatDate(this.model.BlockDate);
        }
        return "";
    }

    public cancel(): void {
        this.$emit("cancel");
    }
}
