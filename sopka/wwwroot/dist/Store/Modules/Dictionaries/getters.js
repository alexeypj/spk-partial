import { Getters } from "./constants";
export const getters = {
    [Getters.IS_SAVING](state) {
        return state.IsSaving;
    },
    [Getters.OBJECT_TYPES_STATE](state) {
        return state.ObjectTypesState;
    },
    [Getters.BRANCHES_STATE](state) {
        return state.BranchesState;
    },
    [Getters.EQUIPMENT_TYPES_STATE](state) {
        return state.EquipmentTypesState;
    },
    [Getters.ATTACK_TYPES_STATE](state) {
        return state.AttackTypesState;
    },
    [Getters.RAID_STATE](state) {
        return state.RaidState;
    },
    [Getters.OS_STATE](state) {
        return state.OSState;
    },
    [Getters.SOFTWARE_STATE](state) {
        return state.SoftwareState;
    },
    [Getters.PLATFORM_STATE](state) {
        return state.PlatformState;
    },
    [Getters.CPU_STATE](state) {
        return state.CPUState;
    },
    [Getters.HDD_STATE](state) {
        return state.HDDState;
    },
    [Getters.RAM_STATE](state) {
        return state.RAMState;
    },
    [Getters.NETWORK_ADAPTER_STATE](state) {
        return state.NetworkAdaptersState;
    },
    [Getters.INCIDENT_CRITICALITY_DICTIONARY](state) {
        return state.IncidentCriticalityDictionary;
    },
    [Getters.EQUIPMENT_TYPES_DICTIONARY](state) {
        if (state.EquipmentTypesState && state.EquipmentTypesState.Items) {
            return state.EquipmentTypesState.Items.map(x => ({ Key: x.Id, Value: x.Title }));
        }
        return [];
    },
    [Getters.EQUIPMENT_LOG_SEVERITY](state) {
        return state.EquipmentLogSeverity;
    }
};
//# sourceMappingURL=getters.js.map