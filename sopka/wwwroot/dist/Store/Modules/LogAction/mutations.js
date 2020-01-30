import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_IS_LOADING](state, value) {
        state.IsLoading = value;
    },
    [Mutations.SET_DICTIONARIES](state, dics) {
        state.Dics = dics;
    },
    [Mutations.SET_LOGS_TOTAL_COUNT](state, total) {
        state.Total = total;
    },
    [Mutations.SET_LOGS](state, logs) {
        state.Logs = logs;
    },
    [Mutations.SET_FILTER](state, filter) {
        state.Filter = filter;
    },
    [Mutations.SET_SELECTED_LOG](state, log) {
        state.SelectedLog = log;
    },
};
//# sourceMappingURL=mutations.js.map