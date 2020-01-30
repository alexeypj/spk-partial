import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
export const state = {
    Object: null,
    Objects: [],
    IsListLoading: false,
    IsContentLoading: false,
    SelectedId: null,
    Dictionaries: {
        Branches: [],
        Types: []
    },
    IsObjectSaving: false,
    EquipmentList: [],
    EquipmentFilter: {
        Page: 1,
        ItemsPerPage: 10
    },
    Equipment: null,
    EquipmentTotalItems: 0,
    Devices: {
        Dictionaries: {
            DeviceTypes: [],
            Platforms: [],
            Objects: [],
            RaidTypes: [],
            CPU: [],
            Memory: [],
            OS: [],
            Software: [],
            HDD: [],
            NetworkAdapters: []
        }
    }
};
export const inventory = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map