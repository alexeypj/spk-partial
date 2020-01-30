import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
import { GetDefaultFilter } from "./types";
const namespaced = true;
export const state = {
    IsLoading: false,
    Folders: [],
    Articles: [],
    ArticleFiles: [],
    Dictionaries: {
        Objects: [],
        CPU: [],
        Memory: [],
        HDD: [],
        NetworkAdapters: [],
        OS: [],
        Software: [],
        Platforms: [],
        AttackTypes: [],
        DeviceTypes: [],
        RaidTypes: []
    },
    Filter: GetDefaultFilter()
};
export const knowledgeBase = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map