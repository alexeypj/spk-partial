import { IUsers, IUserFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: IUsers = {
    Users: [],
    Roles: [],
    Filter: <IUserFilter> {
        Page: 0,
        ItemsPerPage: 10
    },
    UsersTotal: 0,
    IsLoading: false,
    SelectedUserId: null
};

export const users: Module<IUsers, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
