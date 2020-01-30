import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_SETTINGS](state, settings) {
        state.Settings = settings;
    },
    [Mutations.SET_FILE_LIST_LOADING](state, value) {
        state.IsFileListLoading = value;
    }
};
//# sourceMappingURL=mutations.js.map