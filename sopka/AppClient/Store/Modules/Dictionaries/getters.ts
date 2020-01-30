import { GetterTree } from "vuex";
import { IDictionaries, IDirectoryState, IObjectTypeDirectory, IObjectTypesFilter, IBranchDirectory, IBranchesFilter,
    IEquipmentDirectory,
    IEquipmentTypesFilter,
    IAttackTypeDirectory,
    IAttackTypesFilter,
    IRaidDirectory,
    IRaidFilter,
    IOSDirectory,
    IOSFilter,
    ISoftwareDirectory,
    ISoftwareFilter,
    IPlatformDirectory,
    IPlatformFilter,
    ICPUDirectory,
    ICPUFilter,
    IHDDDirectory,
    IHDDFilter,
    IRAMFilter,
    IRAMDirectory,
    INetworkAdapterDirectory,
    INetworkAdapterFilter,
    ISeveritySynonymsDirectory,
    ISeveritySynonymsFilter
} from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";

export const getters: GetterTree<IDictionaries, IRootState> = {

    [Getters.IS_SAVING](state: IDictionaries): boolean {
        return state.IsSaving;
    },
    [Getters.OBJECT_TYPES_STATE](state: IDictionaries): IDirectoryState<IObjectTypeDirectory, IObjectTypesFilter> {
        return state.ObjectTypesState;
    },
    [Getters.BRANCHES_STATE](state: IDictionaries): IDirectoryState<IBranchDirectory, IBranchesFilter> {
        return state.BranchesState;
    },
    [Getters.EQUIPMENT_TYPES_STATE](state: IDictionaries): IDirectoryState<IEquipmentDirectory, IEquipmentTypesFilter> {
        return state.EquipmentTypesState;
    },
    [Getters.ATTACK_TYPES_STATE](state: IDictionaries): IDirectoryState<IAttackTypeDirectory, IAttackTypesFilter> {
        return state.AttackTypesState;
    },
    [Getters.RAID_STATE](state: IDictionaries): IDirectoryState<IRaidDirectory, IRaidFilter> {
        return state.RaidState;
    },
    [Getters.OS_STATE](state: IDictionaries): IDirectoryState<IOSDirectory, IOSFilter> {
        return state.OSState;
    },
    [Getters.SOFTWARE_STATE](state: IDictionaries): IDirectoryState<ISoftwareDirectory, ISoftwareFilter> {
        return state.SoftwareState;
    },
    [Getters.PLATFORM_STATE](state: IDictionaries): IDirectoryState<IPlatformDirectory, IPlatformFilter> {
        return state.PlatformState;
    },
    [Getters.CPU_STATE](state: IDictionaries): IDirectoryState<ICPUDirectory, ICPUFilter> {
        return state.CPUState;
    },
    [Getters.HDD_STATE](state: IDictionaries): IDirectoryState<IHDDDirectory, IHDDFilter> {
        return state.HDDState;
    },
    [Getters.RAM_STATE](state: IDictionaries): IDirectoryState<IRAMDirectory, IRAMFilter> {
        return state.RAMState;
    },
    [Getters.NETWORK_ADAPTER_STATE](state: IDictionaries): IDirectoryState<INetworkAdapterDirectory, INetworkAdapterFilter> {
        return state.NetworkAdaptersState;
    },
    [Getters.INCIDENT_CRITICALITY_DICTIONARY](state: IDictionaries): IDictionaryItem[] {
        return state.IncidentCriticalityDictionary;
    },

    [Getters.EQUIPMENT_TYPES_DICTIONARY](state: IDictionaries): IDictionaryItem[] {
        if (state.EquipmentTypesState && state.EquipmentTypesState.Items) {
            return state.EquipmentTypesState.Items.map(x => <IDictionaryItem> { Key: x.Id, Value: x.Title });
        }
        return [];
    },

    [Getters.EQUIPMENT_LOG_SEVERITY](state: IDictionaries): IDictionaryItem[] {
        return state.EquipmentLogSeverity;
    },

    [Getters.SEVERITY_SYNONYMS_STATE](state: IDictionaries): IDirectoryState<ISeveritySynonymsDirectory, ISeveritySynonymsFilter> {
        return state.SeveritySynonymsState;
    },

};
