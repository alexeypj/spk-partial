import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_IS_LIST_LOADING](state, payload) {
        state.Loading.IsLoading = payload;
    },
    [Mutations.SET_LIST](state, payload) {
        state.RulesList = payload.Items;
        state.RulesCount = payload.Total;
    },
    [Mutations.SET_IS_RULE_SAVING](state, payload) {
        state.Loading.IsSaving = payload;
    },
    [Mutations.SET_FILTER](state, payload) {
        state.Filter = payload;
    },
    [Mutations.SET_IS_LOADING](state, payload) {
        state.Loading.IsLoading = payload;
    }
};
//# sourceMappingURL=mutations.js.map