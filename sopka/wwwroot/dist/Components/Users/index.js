var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/Users/constants";
import { Action, Getter, Mutation } from "vuex-class";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import EditForm from "./EditForm/editForm.vue";
import Modal from "../../Shared/Modals/modal.vue";
import ResetPassword from "./ResetPassword/resetPassword.vue";
import Blocking from "./Blocking/blocking.vue";
import Columnfilter from "../../Shared/Datatable/Filters/filters.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { logAction } from "../../Shared/utils";
import { LogActions } from "../../Shared/LogActions";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.users = [];
        this.errorText = "";
        this.showResetPassword = false;
        this.showBlocking = false;
        this.showBlockingInfo = false;
        this.showColumnFilters = false;
        this.actionValue = "";
        this.columns = [
            { Name: "_Id", DisplayName: "№" },
            { Name: "FIO", DisplayName: "ФИО" },
            { Name: "RoleText", DisplayName: "Роль" },
            { Name: "PhoneNumber", DisplayName: "Телефон" },
            { Name: "Email", DisplayName: "e-mail" },
            { Name: "IsBlockText", DisplayName: "Активен" }
        ];
    }
    onUsersChange() {
        this.initUsers();
    }
    mounted() {
        this.FetchUserList(this.Filter)
            .then(() => {
            if (this.Roles.length === 0) {
                this.FetchRoles()
                    .then(() => this.initUsers())
                    .catch(error => this.errorText = error);
            }
            else {
                this.initUsers();
            }
            const id = this.$router.currentRoute.query.id;
            if (id) {
                this.SetSelectedUserId(id);
            }
        })
            .catch(error => this.errorText = "Ошибка получения списка пользователей");
        logAction(LogActions.UserIndex);
    }
    initUsers() {
        this.users = [...this.Users];
        for (let i = 0; i < this.users.length; i++) {
            this.users[i]._Id = i + 1;
            this.users[i].RoleText = this.getRole(this.users[i]);
            this.users[i].IsBlockText = this.users[i].IsBlock ?
                `Блокирован <i class="fa fa-times" style="color:red"></i>` :
                `Активен  <i class="fa fa-check" style="color:green"></i>`;
        }
    }
    create() {
        this.$router.push({ path: "/Users", query: { id: "0" } });
        this.SetSelectedUserId("0");
    }
    closeModals() {
        this.$router.push({ path: "/Users" });
        this.SetSelectedUserId();
        this.showBlocking = false;
        this.showResetPassword = false;
    }
    reload() {
        this.FetchUserList(this.Filter);
        setTimeout(this.closeModals, 1000);
    }
    getRole(user) {
        if (user && user.UserRoles && user.UserRoles.length > 0) {
            for (const userRole of user.UserRoles) {
                const role = this.Roles.find((x) => x.Id === userRole.RoleId);
                if (role) {
                    return role.Name;
                }
            }
        }
        return "";
    }
    open(id) {
        this.$router.push({ path: "/Users", query: { id: id.toString() } });
        this.SetSelectedUserId(id);
    }
    block(id, onlyBlock = false) {
        if (id) {
            const user = this.Users.find((x) => x.Id === id);
            if (user) {
                if ((onlyBlock && user.IsBlock) || (onlyBlock === false && user.IsBlock === false)) {
                    this.modalUserId = id;
                    this.showBlocking = true;
                }
            }
            return;
        }
    }
    resetPassword(id) {
        if (id) {
            this.modalUserId = id;
        }
        this.showResetPassword = true;
    }
    getActions(user) {
        return [
            { Key: "", Value: "Действия" },
            { Key: "resetPassword", Value: "Сбросить пароль" },
            { Key: "edit", Value: "Редактировать" },
            { Key: "block", Value: user.IsBlock ? "Разблокировать" : "Блокировать" }
        ];
    }
    selectorChange(value, user) {
        switch (value) {
            case "resetPassword":
                this.resetPassword(user.Id);
                break;
            case "block":
                {
                    if (user) {
                        this.block(user.Id, user.IsBlock);
                    }
                }
                break;
            case "edit":
                this.open(user.Id);
                break;
        }
        this.actionValue = "";
    }
    applyFilter(filter) {
        this.SetFilter(filter);
        this.FetchUserList(filter);
    }
    onUserClick(id) {
        const user = this.Users[id - 1];
        if (user && user.IsBlock) {
            this.modalUserId = user.Id;
            this.showBlockingInfo = true;
        }
    }
    get tableFilterOptions() {
        return [
            {
                ForColumn: "_Id",
                FieldName: "Id",
                Type: "none",
                CSSClass: "",
                Value: ""
            },
            {
                ForColumn: "FIO",
                FieldName: "FIO",
                Placeholder: "ФИО",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.FIO : undefined
            },
            {
                ForColumn: "RoleText",
                FieldName: "RoleId",
                Placeholder: "Роль",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.RoleId : undefined,
                SelectValues: this.Roles.map(x => ({ Key: x.Id, Value: x.Name }))
            },
            {
                ForColumn: "PhoneNumber",
                FieldName: "PhoneNumber",
                Placeholder: "Телефон",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.Phone : undefined,
            },
            {
                ForColumn: "Email",
                FieldName: "Email",
                Placeholder: "E-Mail",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.Email : undefined,
            },
            {
                ForColumn: "IsBlockText",
                FieldName: "Status",
                Placeholder: "Состояние",
                Type: "select",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.Status : undefined,
                SelectValues: [{ Key: 0, Value: "Активен" }, { Key: 1, Value: "Блокирован" }]
            },
        ];
    }
};
__decorate([
    Action(Actions.FETCH_USER_LIST, { namespace })
], default_1.prototype, "FetchUserList", void 0);
__decorate([
    Action(Actions.FETCH_ROLES, { namespace })
], default_1.prototype, "FetchRoles", void 0);
__decorate([
    Getter(Getters.IS_LOADING, { namespace })
], default_1.prototype, "IsLoading", void 0);
__decorate([
    Getter(Getters.USER_LIST, { namespace })
], default_1.prototype, "Users", void 0);
__decorate([
    Getter(Getters.FILTER, { namespace })
], default_1.prototype, "Filter", void 0);
__decorate([
    Getter(Getters.SELECTED_USER_ID, { namespace })
], default_1.prototype, "SelectedUserId", void 0);
__decorate([
    Getter(Getters.ROLES, { namespace })
], default_1.prototype, "Roles", void 0);
__decorate([
    Getter(Getters.USERS_TOTAL, { namespace })
], default_1.prototype, "Total", void 0);
__decorate([
    Mutation(Mutations.SET_SELECTED_USER_ID, { namespace })
], default_1.prototype, "SetSelectedUserId", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace })
], default_1.prototype, "SetFilter", void 0);
__decorate([
    Watch("Users")
], default_1.prototype, "onUsersChange", null);
default_1 = __decorate([
    Component({
        components: {
            Datatable,
            EditForm,
            Modal,
            Blocking,
            ResetPassword,
            Columnfilter,
            select2
        }
    })
], default_1);
export default default_1;
//# sourceMappingURL=index.js.map