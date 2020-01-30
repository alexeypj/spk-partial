import { Getters } from "./constants";
import { createFilter } from "./types";
export const getters = {
    [Getters.CURRENT_FILTER](state) {
        return state.Filter;
    },
    [Getters.NEW_FILTER](state) {
        return createFilter();
    },
    [Getters.DICTIONARIES](state) {
        return state.Dictionaries;
    },
    [Getters.IS_LOADING](state) {
        return state.IsLoading;
    },
    [Getters.JOURNAL_LIST](state) {
        return state.Items;
    },
    [Getters.JOURNAL_LIST_TOTAL](state) {
        return state.TotalItems;
    },
};
//# sourceMappingURL=getters.js.map