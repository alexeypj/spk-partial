import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_IS_LOADING](state, value) {
        state.IsLoading = value;
    },
    [Mutations.SET_USERS](state, users) {
        state.Users = users;
    },
    [Mutations.SET_FILTER](state, filter) {
        state.Filter = filter;
    },
    [Mutations.SET_SELECTED_USER_ID](state, id) {
        state.SelectedUserId = id !== undefined ? id : null;
    },
    [Mutations.SET_ROLES](state, roles) {
        state.Roles = roles;
    },
    [Mutations.SET_USERS_TOTAL](state, total) {
        state.UsersTotal = total;
    }
};
//# sourceMappingURL=mutations.js.map