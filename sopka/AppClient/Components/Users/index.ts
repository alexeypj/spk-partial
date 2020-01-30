import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/Users/constants";
import { Action, Getter, Mutation } from "vuex-class";
import { IUser, IUserRole, ISopkaSettings } from "../../Store/Modules/Common/types";
import { IUserFilter, IUserInList } from "../../Store/Modules/Users/types";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import EditForm from "./EditForm/editForm.vue";
import Modal from "../../Shared/Modals/modal.vue";
import ResetPassword from "./ResetPassword/resetPassword.vue";
import Blocking from "./Blocking/blocking.vue";
import Columnfilter from "../../Shared/Datatable/Filters/filters.vue";
import { IFilterOptions, IColumnOptions } from "../../Shared/Datatable/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";
import select2 from "../../Shared/Select2/select2.vue";
import { logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions"
import { Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import IsBlockCell from "./TableCellComponents/IsBlockCell.vue";

@Component({
    components: {
        Datatable,
        EditForm,
        Modal,
        Blocking,
        ResetPassword,
        Columnfilter,
        select2,
        IsBlockCell
    }
})
export default class extends Vue {

    @Action(Actions.FETCH_USER_LIST, { namespace })
    public readonly FetchUserList: (filter: IUserFilter) => Promise<IUser[]>;

    @Action(Actions.FETCH_ROLES, { namespace })
    public FetchRoles: () => Promise<IUserRole[]>;

    @Getter(Getters.IS_LOADING, { namespace })
    public readonly IsLoading: boolean;

    @Getter(Getters.USER_LIST, { namespace })
    public readonly Users: IUser[];

    @Getter(Getters.FILTER, { namespace })
    public readonly Filter: IUserFilter;

    @Getter(Getters.SELECTED_USER_ID, { namespace })
    public readonly SelectedUserId: string | null;

    @Getter(Getters.ROLES, { namespace })
    public readonly Roles: IUserRole[];

    @Getter(Getters.USERS_TOTAL, { namespace })
    public readonly Total: number;

    @Mutation(Mutations.SET_SELECTED_USER_ID, { namespace })
    public readonly SetSelectedUserId: (id?: string) => void;

    @Mutation(Mutations.SET_FILTER, { namespace })
    public readonly SetFilter: (filter: IUserFilter) => void;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Getter(commonGetters.SETTINGS, { namespace: commonNamespace  })
    public readonly Settings: ISopkaSettings;

    @Watch("Users")
    private onUsersChange(): void {
        this.initUsers();
    }

    private users: IUserInList[] = [];

    private errorText: string = "";
    private showResetPassword: boolean = false;
    private showBlocking: boolean = false;
    private showBlockingInfo: boolean = false;
    private modalUserId?: string;
    private showColumnFilters: boolean = false;

    public mounted(): void {
        this.FetchUserList(this.Filter)
            .then(() => {
                if (this.Roles.length === 0) {
                    this.FetchRoles()
                        .then(() => this.initUsers())
                        .catch(error => this.errorText = error);
                } else {
                    this.initUsers();
                }

                const id: any = this.$router.currentRoute.query.id;
                if (id) {
                    this.SetSelectedUserId(id);
                }
            })
            .catch(error => this.errorText = "Ошибка получения списка пользователей");
        logAction(LogActions.UserIndex);
    }

    private initUsers() {
        this.users = [... this.Users];
        for (let i = 0; i < this.users.length; i++) {
            this.users[i]._Id = i + 1;
            this.users[i].RoleText = this.getRole(this.users[i]);
            this.users[i].IsBlockText = this.users[i].IsBlock ? 
                `Блокирован` :
                `Активен`;
        }
    }

    public create(): void {
        this.$router.push({path: "/Users", query: { id : "0"}});
        this.SetSelectedUserId("0");
    }

    public closeModals(): void {
        this.$router.push({ path: "/Users" });
        this.SetSelectedUserId();
        this.showBlocking = false;
        this.showResetPassword = false;
    }

    public reload(): void {
        this.FetchUserList(this.Filter);
        setTimeout(this.closeModals, 1000);
    }

    public getRole(user: IUser): string {
        if (user && user.UserRoles && user.UserRoles.length > 0) {
            for (const userRole of user.UserRoles) {
                const role = this.Roles.find((x: IUserRole) => x.Id === userRole.RoleId);
                if (role) {
                    return role.Name;
                }
            }
        }
        return "";
    }

    public open(id: string): void {
        this.$router.push({path: "/Users", query: { id : id.toString()}});
        this.SetSelectedUserId(id);
    }

    public block(id?: string, onlyBlock: boolean = false): void {
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

    public resetPassword(id?: string): void {
        if (id) {
            this.modalUserId = id;
        }
        this.showResetPassword = true;
    }

    private getActions(user: IUserInList): IDictionaryItem[] {
        return [
            { Key: "resetPassword", Value: "Сбросить пароль" },
            { Key: "edit", Value: "Редактировать" },
            { Key: "block", Value: user.IsBlock ? "Разблокировать" : "Блокировать" }
        ];
    }

    private actionValue: string = "";
    public selectorChange(value: any, user: IUserInList): void {
        switch (value) {
            case "resetPassword": this.resetPassword(user.Id); break;
            case "block": {
                if (user) {
                    this.block(user.Id, user.IsBlock);
                }
            } break;
            case "edit": this.open(user.Id); break;
        }
        this.actionValue = "";
    }

    public applyFilter(filter: IUserFilter) {
        this.SetFilter(filter);
        this.FetchUserList(filter);
    }

    public get IsLimited(): boolean {
        return this.Settings.IsLimited;
    }

    private columns: IColumnOptions[] = [
        { Name: "_Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "FIO", DisplayName: "ФИО", Sort: true, SortColumnName: "FIO" },
        { Name: "RoleText", DisplayName: "Роль", Sort: true, SortColumnName: "RoleId" },
        { Name: "PhoneNumber", DisplayName: "Телефон", Sort: true, SortColumnName: "PhoneNumber" },
        { Name: "Email", DisplayName: "e-mail", Sort: true, SortColumnName: "Email" },
        { Name: "IsBlockText", DisplayName: "Активен", Sort: true, SortColumnName: "IsBlock", UseComponent: true, Component: IsBlockCell }
    ];

    public onUserClick(id: number): void {
        const user = this.Users[id - 1];
        if (user && user.IsBlock) {
            this.modalUserId = user.Id;
            this.showBlockingInfo = true;
        }
    }

    get tableFilterOptions(): IFilterOptions[] {
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
                SelectValues: this.Roles.map(x => <IDictionaryItem>{ Key: x.Id, Value: x.Name })
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
                SelectValues: [{Key: 0, Value: "Активен"}, { Key: 1, Value: "Блокирован"}]
            },
        ];
    }
}
