import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_IS_SAVING](state, value) {
        state.IsSaving = value;
    },
    [Mutations.SET_OBJECT_TYPES_DIRECTORY](state, directory) {
        state.ObjectTypesState.Items = directory;
    },
    [Mutations.SET_OBJECT_TYPES_TOTAL_ITEMS](state, totalItems) {
        state.ObjectTypesState.TotalItems = totalItems;
    },
    [Mutations.SET_OBJECT_TYPES_FILTER](state, filter) {
        state.ObjectTypesState.Filter = filter;
    },
    [Mutations.SET_BRANCHES_DIRECTORY](state, directory) {
        state.BranchesState.Items = directory;
    },
    [Mutations.SET_BRANCHES_TOTAL_ITEMS](state, totalItems) {
        state.BranchesState.TotalItems = totalItems;
    },
    [Mutations.SET_BRANCHES_FILTER](state, filter) {
        state.BranchesState.Filter = filter;
    },
    [Mutations.SET_EQUIPMENT_TYPES_DIRECTORY](state, directory) {
        state.EquipmentTypesState.Items = directory;
    },
    [Mutations.SET_EQUIPMENT_TYPES_TOTAL_ITEMS](state, totalItems) {
        state.EquipmentTypesState.TotalItems = totalItems;
    },
    [Mutations.SET_EQUIPMENT_TYPES_FILTER](state, filter) {
        state.EquipmentTypesState.Filter = filter;
    },
    [Mutations.SET_ATTACK_TYPES_DIRECTORY](state, directory) {
        state.AttackTypesState.Items = directory;
    },
    [Mutations.SET_ATTACK_TYPES_TOTAL_ITEMS](state, totalItems) {
        state.AttackTypesState.TotalItems = totalItems;
    },
    [Mutations.SET_ATTACK_TYPES_FILTER](state, filter) {
        state.AttackTypesState.Filter = filter;
    },
    [Mutations.SET_RAID_DIRECTORY](state, directory) {
        state.RaidState.Items = directory;
    },
    [Mutations.SET_RAID_TOTAL_ITEMS](state, totalItems) {
        state.RaidState.TotalItems = totalItems;
    },
    [Mutations.SET_RAID_FILTER](state, filter) {
        state.RaidState.Filter = filter;
    },
    [Mutations.SET_OS_DIRECTORY](state, directory) {
        state.OSState.Items = directory;
    },
    [Mutations.SET_OS_TOTAL_ITEMS](state, totalItems) {
        state.OSState.TotalItems = totalItems;
    },
    [Mutations.SET_OS_FILTER](state, filter) {
        state.OSState.Filter = filter;
    },
    [Mutations.SET_SOFTWARE_DIRECTORY](state, directory) {
        state.SoftwareState.Items = directory;
    },
    [Mutations.SET_SOFTWARE_TOTAL_ITEMS](state, totalItems) {
        state.SoftwareState.TotalItems = totalItems;
    },
    [Mutations.SET_SOFTWARE_FILTER](state, filter) {
        state.SoftwareState.Filter = filter;
    },
    [Mutations.SET_PLATFORM_DIRECTORY](state, directory) {
        state.PlatformState.Items = directory;
    },
    [Mutations.SET_PLATFORM_TOTAL_ITEMS](state, totalItems) {
        state.PlatformState.TotalItems = totalItems;
    },
    [Mutations.SET_PLATFORM_FILTER](state, filter) {
        state.PlatformState.Filter = filter;
    },
    [Mutations.SET_CPU_DIRECTORY](state, directory) {
        state.CPUState.Items = directory;
    },
    [Mutations.SET_CPU_TOTAL_ITEMS](state, totalItems) {
        state.CPUState.TotalItems = totalItems;
    },
    [Mutations.SET_CPU_FILTER](state, filter) {
        state.CPUState.Filter = filter;
    },
    [Mutations.SET_HDD_DIRECTORY](state, directory) {
        state.HDDState.Items = directory;
    },
    [Mutations.SET_HDD_TOTAL_ITEMS](state, totalItems) {
        state.HDDState.TotalItems = totalItems;
    },
    [Mutations.SET_HDD_FILTER](state, filter) {
        state.HDDState.Filter = filter;
    },
    [Mutations.SET_RAM_DIRECTORY](state, directory) {
        state.RAMState.Items = directory;
    },
    [Mutations.SET_RAM_TOTAL_ITEMS](state, totalItems) {
        state.RAMState.TotalItems = totalItems;
    },
    [Mutations.SET_RAM_FILTER](state, filter) {
        state.RAMState.Filter = filter;
    },
    [Mutations.SET_NETWORK_ADAPTER_DIRECTORY](state, directory) {
        state.NetworkAdaptersState.Items = directory;
    },
    [Mutations.SET_NETWORK_ADAPTER_TOTAL_ITEMS](state, totalItems) {
        state.NetworkAdaptersState.TotalItems = totalItems;
    },
    [Mutations.SET_NETWORK_ADAPTER_FILTER](state, filter) {
        state.NetworkAdaptersState.Filter = filter;
    },
    [Mutations.SET_INCIDENT_CRITICALITY_DICTIONARY](state, dic) {
        state.IncidentCriticalityDictionary = dic;
    },
    [Mutations.SET_EQUIPMENT_LOG_SEVERITY](state, payload) {
        state.EquipmentLogSeverity = payload;
    }
};
//# sourceMappingURL=mutations.js.map