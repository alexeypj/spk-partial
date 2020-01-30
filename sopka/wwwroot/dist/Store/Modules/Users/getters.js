import { Getters } from "./constants";
export const getters = {
    [Getters.FILTER](state) {
        return state.Filter;
    },
    [Getters.IS_LOADING](state) {
        return state.IsLoading;
    },
    [Getters.USER_LIST](state) {
        return state.Users;
    },
    [Getters.SELECTED_USER_ID](state) {
        return state.SelectedUserId;
    },
    [Getters.ROLES](state) {
        return state.Roles;
    },
    [Getters.USERS_TOTAL](state) {
        return state.UsersTotal;
    }
};
//# sourceMappingURL=getters.js.map