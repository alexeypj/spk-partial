import { DictionariesTab } from "./types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
const filter = {
    Page: 1,
    ItemsPerPage: 20,
    SortColumn: "",
    Query: "",
    SortDirection: ""
};
export const state = {
    IsSaving: false,
    CurrentTab: DictionariesTab.ObjectTypes,
    Dictionaries: [],
    ObjectTypesState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    BranchesState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    EquipmentTypesState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    AttackTypesState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0,
    },
    RaidState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    OSState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    SoftwareState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    PlatformState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    CPUState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    HDDState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    RAMState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    NetworkAdaptersState: {
        Filter: Object.assign({}, filter),
        Items: [],
        TotalItems: 0
    },
    IncidentCriticalityDictionary: [],
    EquipmentLogSeverity: []
};
export const dictionaries = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map