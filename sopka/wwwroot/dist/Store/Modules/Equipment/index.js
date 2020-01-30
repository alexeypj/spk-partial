import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
export const state = {
    Equipments: [],
    Filter: {
        Page: 1,
        ItemsPerPage: 10,
        ObjectId: "",
        CPUId: "",
        HDDId: "",
        MemoryId: "",
        NetworkAdapterId: "",
        OperationSystemId: "",
        SoftwareId: "",
        SortColumn: "",
        SortDirection: "",
    },
    SelectedId: null,
    IsContentLoading: false,
    EquipmentTotalItems: 0,
    Dictionaries: {
        Objects: [],
        CPU: [],
        Memory: [],
        HDD: [],
        NetworkAdapters: [],
        OS: [],
        Software: [],
        Platforms: [],
        DeviceTypes: [],
        RaidTypes: []
    }
};
export const equipment = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map