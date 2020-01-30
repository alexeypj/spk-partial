import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
export const state = {
    Users: [],
    Roles: [],
    Filter: {
        Page: 0,
        ItemsPerPage: 10
    },
    UsersTotal: 0,
    IsLoading: false,
    SelectedUserId: null
};
export const users = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map