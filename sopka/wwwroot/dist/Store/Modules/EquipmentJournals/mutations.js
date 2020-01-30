import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_IS_LOADING](state, payload) {
        state.IsLoading = payload;
    },
    [Mutations.SET_DICTIONARIES](state, payload) {
        state.Dictionaries = payload;
    },
    [Mutations.SET_JOURNAL_LIST](state, payload) {
        state.Items = payload;
    },
    [Mutations.SET_JOURNAL_TOTAL_ITEMS](state, payload) {
        state.TotalItems = payload;
    },
    [Mutations.SET_FILTER](state, payload) {
        state.Filter = payload;
    },
};
//# sourceMappingURL=mutations.js.map