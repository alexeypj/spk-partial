import { MutationTree } from "vuex";
import { IUsers, IUserFilter } from "./types";
import { Mutations } from "./constants";
import { IUser, IUserRole } from "../Common/types";

export const mutations: MutationTree<IUsers> = {

    [Mutations.SET_IS_LOADING](state: IUsers, value: boolean): void {
        state.IsLoading = value;
    },

    [Mutations.SET_USERS](state: IUsers, users: IUser[]): void {
        state.Users = users;
    },

    [Mutations.SET_FILTER](state: IUsers, filter: IUserFilter): void {
        state.Filter = filter;
    },

    [Mutations.SET_SELECTED_USER_ID](state: IUsers, id?: string): void {
        state.SelectedUserId = id !== undefined ? id : null;
    },

    [Mutations.SET_ROLES](state: IUsers, roles: IUserRole[]): void {
        state.Roles = roles;
    },

    [Mutations.SET_USERS_TOTAL](state: IUsers, total: number): void {
        state.UsersTotal = total;
    }
};
