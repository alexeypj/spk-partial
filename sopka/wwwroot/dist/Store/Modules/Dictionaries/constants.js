// tslint:disable max-classes-per-file
export const namespace = "dictionaries";
export class Actions {
}
Actions.STORE_EQUIPMENT_TYPE = "STORE_EQUIPMENT_TYPE";
Actions.STORE_EQUIPMENT_PLATFORM = "STORE_EQUIPMENT_PLATFORM";
Actions.STORE_EQUIPMENT_PROCESSOR = "STORE_EQUIPMENT_PROCESSOR";
Actions.STORE_EQUIPMENT_MEMORY = "STORE_EQUIPMENT_MEMORY";
Actions.STORE_EQUIPMENT_HDD = "STORE_EQUIPMENT_HDD";
Actions.STORE_EQUIPMENT_NETWORK_ADAPTER = "STORE_EQUIPMENT_NETWORK_ADAPTER";
Actions.STORE_EQUIPMENT_SOFTWARE = "STORE_EQUIPMENT_SOFTWARE";
Actions.STORE_EQUIPMENT_OS = "STORE_EQUIPMENT_OS";
Actions.STORE_OBJECT_TYPE = "STORE_OBJECT_TYPE";
Actions.STORE_BRANCH = "STORE_BRANCH";
Actions.STORE_ATTACK_TYPE = "STORE_ATTACK_TYPE";
Actions.STORE_RAID = "STORE_RAID";
Actions.REMOVE_OBJECT_TYPE = "REMOVE_OBJECT_TYPE";
Actions.REMOVE_BRANCH = "REMOVE_BRANCH";
Actions.REMOVE_EQUIPMENT_TYPE = "REMOVE_EQUIPMENT_TYPE";
Actions.REMOVE_ATTACK_TYPE = "REMOVE_ATTACK_TYPE";
Actions.REMOVE_RAID = "REMOVE_RAID";
Actions.REMOVE_OS = "REMOVE_OS";
Actions.REMOVE_SOFTWARE = "REMOVE_SOFTWARE";
Actions.REMOVE_PLATFORM = "REMOVE_PLATFORM";
Actions.REMOVE_CPU = "REMOVE_CPU";
Actions.REMOVE_HDD = "REMOVE_HDD";
Actions.REMOVE_RAM = "REMOVE_RAM";
Actions.REMOVE_NETWORK_ADAPTER = "REMOVE";
Actions.FETCH_OBJECT_TYPES_DIRECTORY = "FETCH_OBJECT_TYPES_DIRECTORY";
Actions.FETCH_BRANCHES_DIRECTORY = "FETCH_BRANCHES_DIRECTORY";
Actions.FETCH_EQUIPMENT_TYPE_DIRECTORY = "FETCH_EQUIPMENT_TYPE_DIRECTORY";
Actions.FETCH_ATTACK_TYPE_DIRECTORY = "FETCH_ATTACK_TYPE_DIRECTORY";
Actions.FETCH_RAID = "FETCH_RAID";
Actions.FETCH_OS = "FETCH_OS";
Actions.FETCH_SOFTWARE = "FETCH_SOFTWARE";
Actions.FETCH_PLATFORM = "FETCH_PLATFORM";
Actions.FETCH_CPU = "FETCH_CPU";
Actions.FETCH_HDD = "FETCH_HDD";
Actions.FETCH_RAM = "FETCH_RAM";
Actions.FETCH_NETWORK_ADAPTER = "FETCH_NETWORK_ADAPTER";
Actions.FETCH_EQUIPMENT_LOG_SEVERITY = "FETCH_EQUIPMENT_LOG_SEVERITY";
Actions.STORE_INCIDENT_CRITICALITY = "STORE_INCIDENT_CRITICALITY";
Actions.FETCH_INCIDENT_CRITICALITY_DIC = "FETCH_INCIDENT_CRITICALITY_DIC";
export class Mutations {
}
Mutations.SET_IS_SAVING = "SET_IS_SAVING";
Mutations.SET_OBJECT_TYPES_DIRECTORY = "SET_OBJECT_TYPES_DIRECTORY";
Mutations.SET_OBJECT_TYPES_FILTER = "SET_OBJECT_TYPES_FILTER";
Mutations.SET_OBJECT_TYPES_TOTAL_ITEMS = "SET_OBJECT_TYPES_TOTAL_ITEMS";
Mutations.SET_BRANCHES_DIRECTORY = "SET_BRANCHES_DIRECTORY";
Mutations.SET_BRANCHES_FILTER = "SET_BRANCHES_FILTER";
Mutations.SET_BRANCHES_TOTAL_ITEMS = "SET_BRANCHES_TOTAL_ITEMS";
Mutations.SET_EQUIPMENT_TYPES_DIRECTORY = "SET_EQUIPMENT_TYPES_DIRECTORY";
Mutations.SET_EQUIPMENT_TYPES_FILTER = "SET_EQUIPMENT_TYPES_FILTER";
Mutations.SET_EQUIPMENT_TYPES_TOTAL_ITEMS = "SET_EQUIPMENT_TYPES_TOTAL_ITEMS";
Mutations.SET_ATTACK_TYPES_DIRECTORY = "SET_ATTACK_TYPES_DIRECTORY";
Mutations.SET_ATTACK_TYPES_FILTER = "SET_ATTACK_TYPES_FILTER";
Mutations.SET_ATTACK_TYPES_TOTAL_ITEMS = "SET_ATTACK_TYPES_TOTAL_ITEMS";
Mutations.SET_RAID_DIRECTORY = "SET_RAID_DIRECTORY";
Mutations.SET_RAID_FILTER = "SET_RAID_FILTER";
Mutations.SET_RAID_TOTAL_ITEMS = "SET_RAID_TOTAL_ITEMS";
Mutations.SET_OS_DIRECTORY = "SET_OS_DIRECTORY";
Mutations.SET_OS_FILTER = "SET_OS_FILTER";
Mutations.SET_OS_TOTAL_ITEMS = "SET_OS_TOTAL_ITEMS";
Mutations.SET_SOFTWARE_DIRECTORY = "SET_SOFTWARE_DIRECTORY";
Mutations.SET_SOFTWARE_FILTER = "SET_SOFTWARE_FILTER";
Mutations.SET_SOFTWARE_TOTAL_ITEMS = "SET_SOFTWARE_TOTAL_ITEMS";
Mutations.SET_PLATFORM_DIRECTORY = "SET_PLATFORM_DIRECTORY";
Mutations.SET_PLATFORM_FILTER = "SET_PLATFORM_FILTER";
Mutations.SET_PLATFORM_TOTAL_ITEMS = "SET_PLATFORM_TOTAL_ITEMS";
Mutations.SET_CPU_DIRECTORY = "SET_CPU_DIRECTORY";
Mutations.SET_CPU_FILTER = "SET_CPU_FILTER";
Mutations.SET_CPU_TOTAL_ITEMS = "SET_CPU_TOTAL_ITEMS";
Mutations.SET_HDD_DIRECTORY = "SET_HDD_DIRECTORY";
Mutations.SET_HDD_FILTER = "SET_HDD_FILTER";
Mutations.SET_HDD_TOTAL_ITEMS = "SET_HDD_TOTAL_ITEMS";
Mutations.SET_RAM_DIRECTORY = "SET_RAM_DIRECTORY";
Mutations.SET_RAM_FILTER = "SET_RAM_FILTER";
Mutations.SET_RAM_TOTAL_ITEMS = "SET_RAM_TOTAL_ITEMS";
Mutations.SET_NETWORK_ADAPTER_DIRECTORY = "NETWORK";
Mutations.SET_NETWORK_ADAPTER_FILTER = "SET_NETWORK_ADAPTER_FILTER";
Mutations.SET_NETWORK_ADAPTER_TOTAL_ITEMS = "SET_NETWORK_ADAPTER_TOTAL_ITEMS";
Mutations.SET_INCIDENT_CRITICALITY_DICTIONARY = "SET_INCIDENT_CRITICALITY_DICTIONARY";
Mutations.SET_EQUIPMENT_LOG_SEVERITY = "SET_EQUIPMENT_LOG_SEVERITY";
export class Getters {
}
Getters.IS_SAVING = "IS_SAVING";
Getters.OBJECT_TYPES_STATE = "OBJECT_TYPES_STATE";
Getters.BRANCHES_STATE = "BRANCHES_STATE";
Getters.EQUIPMENT_TYPES_STATE = "EQUIPMENT_TYPES_STATE";
Getters.EQUIPMENT_TYPES_DICTIONARY = "EQUIPMENT_TYPES_DICTIONARY";
Getters.ATTACK_TYPES_STATE = "ATTACK_TYPES_STATE";
Getters.RAID_STATE = "RAID_STATE";
Getters.OS_STATE = "OS_STATE";
Getters.SOFTWARE_STATE = "SOFTWARE_STATE";
Getters.PLATFORM_STATE = "PLATFORM_STATE";
Getters.CPU_STATE = "CPU_STATE";
Getters.HDD_STATE = "HDD_STATE";
Getters.RAM_STATE = "RAM_STATE";
Getters.NETWORK_ADAPTER_STATE = "NETWORK_ADAPTER_STATE";
Getters.INCIDENT_CRITICALITY_DICTIONARY = "INCIDENT_CRITICALITY_DICTIONARY";
Getters.EQUIPMENT_LOG_SEVERITY = "EQUIPMENT_LOG_SEVERITY";
//# sourceMappingURL=constants.js.map