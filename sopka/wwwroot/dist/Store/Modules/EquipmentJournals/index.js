import { createFilter } from "./types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
export const state = {
    Filter: createFilter(),
    Items: [],
    TotalItems: 0,
    Dictionaries: {
        Objects: [],
        EquipmentTypes: [],
        Platforms: [],
        Equipments: []
    },
    IsLoading: false
};
export const equipmentJournals = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map