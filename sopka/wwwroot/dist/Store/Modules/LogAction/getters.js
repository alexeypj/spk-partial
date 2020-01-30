import { GetDefaultFilter } from "./types";
import { Getters } from "./constants";
export const getters = {
    [Getters.LOGS](state) {
        return state.Logs;
    },
    [Getters.DICTIONARIES](state) {
        return state.Dics;
    },
    [Getters.LOGS_TOTAL_COUNT](state) {
        return state.Total;
    },
    [Getters.FILTER](state) {
        return state.Filter;
    },
    [Getters.GET_NEW_FILTER](state) {
        return GetDefaultFilter();
    },
    [Getters.GET_SELECTED_LOG](state) {
        return state.SelectedLog;
    },
};
//# sourceMappingURL=getters.js.map