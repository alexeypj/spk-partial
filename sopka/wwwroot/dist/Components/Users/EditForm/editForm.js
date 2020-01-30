var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { User } from "../../../Store/Modules/Common/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Users/constants";
import select2 from "../../../Shared/Select2/select2.vue";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.model = User.getDefault();
        this.errorText = "";
        this.isSaved = false;
        this.roleId = "";
    }
    mounted() {
        this.FetchUser(this.UserId).then((result) => {
            this.model = Object.assign({}, result);
            this.roleId = "";
            if (result.UserRoles && result.UserRoles.length > 0) {
                this.roleId = result.UserRoles[0].RoleId;
            }
        }).catch((error) => this.errorText = error);
    }
    store() {
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
    cancel() {
        this.$emit("cancel");
    }
    get rolesDict() {
        return this.Roles.map(x => ({ Key: x.Id, Value: x.Name }));
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "UserId", void 0);
__decorate([
    Action(Actions.FETCH_USER, { namespace })
], default_1.prototype, "FetchUser", void 0);
__decorate([
    Action(Actions.STORE_USER, { namespace })
], default_1.prototype, "Store", void 0);
__decorate([
    Getter(Getters.ROLES, { namespace })
], default_1.prototype, "Roles", void 0);
default_1 = __decorate([
    Component({
        components: {
            select2
        }
    })
], default_1);
export default default_1;
//# sourceMappingURL=editForm.js.map