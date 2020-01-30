import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
import { GetDefaultFilter } from "./types";
const namespaced = true;
export const state = {
    Logs: [],
    Total: 0,
    IsLoading: false,
    Filter: GetDefaultFilter(),
    Dics: {
        Actions: [],
        Users: [],
        ActionTypes: [],
        EntityTypes: []
    },
    SelectedLog: null
};
export const logAction = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map