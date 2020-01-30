import { GetterTree } from "vuex";
import { IUsers, IUserFilter } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";
import { IUserRole, IUser } from "../Common/types";

export const getters: GetterTree<IUsers, IRootState> = {

    [Getters.FILTER](state: IUsers): IUserFilter {
        return state.Filter;
    },

    [Getters.IS_LOADING](state: IUsers): boolean {
        return state.IsLoading;
    },

    [Getters.USER_LIST](state: IUsers): IUser[] {
        return state.Users;
    },

    [Getters.SELECTED_USER_ID](state: IUsers): string|null {
        return state.SelectedUserId;
    },

    [Getters.ROLES](state: IUsers): IUserRole[] {
        return state.Roles;
    },

    [Getters.USERS_TOTAL](state: IUsers): number {
        return state.UsersTotal;
    },

    [Getters.USER_BY_ID](state: IUsers): (id: string) => IUser|undefined {
        return (id: string): IUser|undefined => {
            return state.Users.find(x => x.Id === id);
        };
    }
};
