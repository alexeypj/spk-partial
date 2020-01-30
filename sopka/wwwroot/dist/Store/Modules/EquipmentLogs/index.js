import { createFilter } from "./types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
export const state = {
    RulesList: [],
    RulesCount: 0,
    Loading: {
        IsOneLoading: false,
        IsLoading: false,
        IsSaving: false
    },
    Filter: createFilter()
};
export const equipmentLogs = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map