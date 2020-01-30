import { MutationTree } from "vuex";
import { IDictionaries, IObjectTypeDirectory, IDictionaryFilter, IObjectTypesFilter, IBranchDirectory, IBranchesFilter, IEquipmentDirectory,
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
    IRAMDirectory,
    IRAMFilter,
    INetworkAdapterDirectory,
    INetworkAdapterFilter,
    ISeveritySynonymsDirectory,
    ISeveritySynonymsFilter
} from "./types";
import { Mutations } from "./constants";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";

export const mutations: MutationTree<IDictionaries> = {

    [Mutations.SET_IS_SAVING](state: IDictionaries, value: boolean): void {
        state.IsSaving = value;
    },

    [Mutations.SET_OBJECT_TYPES_DIRECTORY](state: IDictionaries, directory: Array<IObjectTypeDirectory>): void {
        state.ObjectTypesState.Items = directory;
    },
    [Mutations.SET_OBJECT_TYPES_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.ObjectTypesState.TotalItems = totalItems;
    },
    [Mutations.SET_OBJECT_TYPES_FILTER](state: IDictionaries, filter: IObjectTypesFilter): void {
        state.ObjectTypesState.Filter = filter;
    },

    [Mutations.SET_BRANCHES_DIRECTORY](state: IDictionaries, directory: Array<IBranchDirectory>): void {
        state.BranchesState.Items = directory;
    },
    [Mutations.SET_BRANCHES_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.BranchesState.TotalItems = totalItems;
    },
    [Mutations.SET_BRANCHES_FILTER](state: IDictionaries, filter: IBranchesFilter): void {
        state.BranchesState.Filter = filter;
    },

    [Mutations.SET_EQUIPMENT_TYPES_DIRECTORY](state: IDictionaries, directory: Array<IEquipmentDirectory>): void {
        state.EquipmentTypesState.Items = directory;
    },
    [Mutations.SET_EQUIPMENT_TYPES_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.EquipmentTypesState.TotalItems = totalItems;
    },
    [Mutations.SET_EQUIPMENT_TYPES_FILTER](state: IDictionaries, filter: IEquipmentTypesFilter): void {
        state.EquipmentTypesState.Filter = filter;
    },

    [Mutations.SET_ATTACK_TYPES_DIRECTORY](state: IDictionaries, directory: Array<IAttackTypeDirectory>): void {
        state.AttackTypesState.Items = directory;
    },
    [Mutations.SET_ATTACK_TYPES_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.AttackTypesState.TotalItems = totalItems;
    },
    [Mutations.SET_ATTACK_TYPES_FILTER](state: IDictionaries, filter: IAttackTypesFilter): void {
        state.AttackTypesState.Filter = filter;
    },

    [Mutations.SET_RAID_DIRECTORY](state: IDictionaries, directory: Array<IRaidDirectory>): void {
        state.RaidState.Items = directory;
    },
    [Mutations.SET_RAID_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.RaidState.TotalItems = totalItems;
    },
    [Mutations.SET_RAID_FILTER](state: IDictionaries, filter: IRaidFilter): void {
        state.RaidState.Filter = filter;
    },

    [Mutations.SET_OS_DIRECTORY](state: IDictionaries, directory: Array<IOSDirectory>): void {
        state.OSState.Items = directory;
    },
    [Mutations.SET_OS_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.OSState.TotalItems = totalItems;
    },
    [Mutations.SET_OS_FILTER](state: IDictionaries, filter: IOSFilter): void {
        state.OSState.Filter = filter;
    },

    [Mutations.SET_SOFTWARE_DIRECTORY](state: IDictionaries, directory: Array<ISoftwareDirectory>): void {
        state.SoftwareState.Items = directory;
    },
    [Mutations.SET_SOFTWARE_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.SoftwareState.TotalItems = totalItems;
    },
    [Mutations.SET_SOFTWARE_FILTER](state: IDictionaries, filter: ISoftwareFilter): void {
        state.SoftwareState.Filter = filter;
    },

    [Mutations.SET_PLATFORM_DIRECTORY](state: IDictionaries, directory: Array<IPlatformDirectory>): void {
        state.PlatformState.Items = directory;
    },
    [Mutations.SET_PLATFORM_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.PlatformState.TotalItems = totalItems;
    },
    [Mutations.SET_PLATFORM_FILTER](state: IDictionaries, filter: IPlatformFilter): void {
        state.PlatformState.Filter = filter;
    },

    [Mutations.SET_CPU_DIRECTORY](state: IDictionaries, directory: Array<ICPUDirectory>): void {
        state.CPUState.Items = directory;
    },
    [Mutations.SET_CPU_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.CPUState.TotalItems = totalItems;
    },
    [Mutations.SET_CPU_FILTER](state: IDictionaries, filter: ICPUFilter): void {
        state.CPUState.Filter = filter;
    },

    [Mutations.SET_HDD_DIRECTORY](state: IDictionaries, directory: Array<IHDDDirectory>): void {
        state.HDDState.Items = directory;
    },
    [Mutations.SET_HDD_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.HDDState.TotalItems = totalItems;
    },
    [Mutations.SET_HDD_FILTER](state: IDictionaries, filter: IHDDFilter): void {
        state.HDDState.Filter = filter;
    },

    [Mutations.SET_RAM_DIRECTORY](state: IDictionaries, directory: Array<IRAMDirectory>): void {
        state.RAMState.Items = directory;
    },
    [Mutations.SET_RAM_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.RAMState.TotalItems = totalItems;
    },
    [Mutations.SET_RAM_FILTER](state: IDictionaries, filter: IRAMFilter): void {
        state.RAMState.Filter = filter;
    },

    [Mutations.SET_NETWORK_ADAPTER_DIRECTORY](state: IDictionaries, directory: Array<INetworkAdapterDirectory>): void {
        state.NetworkAdaptersState.Items = directory;
    },
    [Mutations.SET_NETWORK_ADAPTER_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.NetworkAdaptersState.TotalItems = totalItems;
    },
    [Mutations.SET_NETWORK_ADAPTER_FILTER](state: IDictionaries, filter: INetworkAdapterFilter): void {
        state.NetworkAdaptersState.Filter = filter;
    },

    [Mutations.SET_SEVERITY_SYNONYMS_DIRECTORY](state: IDictionaries, directory: Array<ISeveritySynonymsDirectory>): void {
        state.SeveritySynonymsState.Items = directory;
    },
    [Mutations.SET_SEVERITY_SYNONYMS_TOTAL_ITEMS](state: IDictionaries, totalItems: number): void {
        state.SeveritySynonymsState.TotalItems = totalItems;
    },
    [Mutations.SET_SEVERITY_SYNONYMS_FILTER](state: IDictionaries, filter: ISeveritySynonymsFilter): void {
        state.SeveritySynonymsState.Filter = filter;
    },

    [Mutations.SET_INCIDENT_CRITICALITY_DICTIONARY](state: IDictionaries, dic: IDictionaryItem[]): void {
        state.IncidentCriticalityDictionary = dic;
    },

    [Mutations.SET_EQUIPMENT_LOG_SEVERITY](state: IDictionaries, payload: IDictionaryItem[]) {
        state.EquipmentLogSeverity = payload;
    }
};
