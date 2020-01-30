import { Actions, Mutations } from "./constants";
import Axios from "axios";
import { urlHelper, logError } from "../../../Shared/utils";
export const actions = {
    [Actions.STORE_EQUIPMENT_TYPE]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentType", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_EQUIPMENT_PLATFORM]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentPlatform", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_EQUIPMENT_PROCESSOR]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentProcessor", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_EQUIPMENT_MEMORY]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentMemory", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_EQUIPMENT_HDD]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentHDD", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_EQUIPMENT_NETWORK_ADAPTER]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentNetworkAdapter", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_EQUIPMENT_SOFTWARE]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentSoftware", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_EQUIPMENT_OS]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentOS", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_OBJECT_TYPE]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateObjectType", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_BRANCH]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateBranch", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_ATTACK_TYPE]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateAttackType", "Directories"), model, resolve, reject);
        });
    },
    [Actions.STORE_RAID]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateRaid", "Directories"), model, resolve, reject);
        });
    },
    [Actions.REMOVE_OBJECT_TYPE]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveObjectType", "Directories"), id, resolve, reject);
            //performRequest(commit, urlHelper("RemoveObjectType", "Directories") + "?id=" + id, null, resolve, reject);
        });
    },
    [Actions.REMOVE_EQUIPMENT_TYPE]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveEquipmentType", "Directories"), id, resolve, reject);
            //performRequest(commit, urlHelper("RemoveObjectType", "Directories") + "?id=" + id, null, resolve, reject);
        });
    },
    [Actions.REMOVE_BRANCH]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveBranch", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_ATTACK_TYPE]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveAttackType", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_RAID]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveRaid", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_OS]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveOS", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_SOFTWARE]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveSoftware", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_PLATFORM]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemovePlatform", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_CPU]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveProcessor", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_HDD]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveHDD", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_RAM]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveRAM", "Directories"), id, resolve, reject);
        });
    },
    [Actions.REMOVE_NETWORK_ADAPTER]({ commit }, id) {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveNetworkAdapter", "Directories"), id, resolve, reject);
        });
    },
    [Actions.FETCH_OBJECT_TYPES_DIRECTORY]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetObjectTypes", "Directories"), filter, data => {
                commit(Mutations.SET_OBJECT_TYPES_DIRECTORY, data.Items);
                commit(Mutations.SET_OBJECT_TYPES_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_BRANCHES_DIRECTORY]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetBranches", "Directories"), filter, data => {
                commit(Mutations.SET_BRANCHES_DIRECTORY, data.Items);
                commit(Mutations.SET_BRANCHES_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_EQUIPMENT_TYPE_DIRECTORY]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetEquipmentTypes", "Directories"), filter, data => {
                commit(Mutations.SET_EQUIPMENT_TYPES_DIRECTORY, data.Items);
                commit(Mutations.SET_EQUIPMENT_TYPES_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_ATTACK_TYPE_DIRECTORY]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetAttackTypes", "Directories"), filter, data => {
                commit(Mutations.SET_ATTACK_TYPES_DIRECTORY, data.Items);
                commit(Mutations.SET_ATTACK_TYPES_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_RAID]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetRaid", "Directories"), filter, data => {
                commit(Mutations.SET_RAID_DIRECTORY, data.Items);
                commit(Mutations.SET_RAID_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_OS]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetOS", "Directories"), filter, data => {
                commit(Mutations.SET_OS_DIRECTORY, data.Items);
                commit(Mutations.SET_OS_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_SOFTWARE]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetSoftware", "Directories"), filter, data => {
                commit(Mutations.SET_SOFTWARE_DIRECTORY, data.Items);
                commit(Mutations.SET_SOFTWARE_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_PLATFORM]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetPlatforms", "Directories"), filter, data => {
                commit(Mutations.SET_PLATFORM_DIRECTORY, data.Items);
                commit(Mutations.SET_PLATFORM_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_CPU]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetProcessors", "Directories"), filter, data => {
                commit(Mutations.SET_CPU_DIRECTORY, data.Items);
                commit(Mutations.SET_CPU_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_HDD]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetHDD", "Directories"), filter, data => {
                commit(Mutations.SET_HDD_DIRECTORY, data.Items);
                commit(Mutations.SET_HDD_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_RAM]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetRAM", "Directories"), filter, data => {
                commit(Mutations.SET_RAM_DIRECTORY, data.Items);
                commit(Mutations.SET_RAM_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_NETWORK_ADAPTER]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetNetworkAdapters", "Directories"), filter, data => {
                commit(Mutations.SET_NETWORK_ADAPTER_DIRECTORY, data.Items);
                commit(Mutations.SET_NETWORK_ADAPTER_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_NETWORK_ADAPTER]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetNetworkAdapters", "Directories"), filter, data => {
                commit(Mutations.SET_NETWORK_ADAPTER_DIRECTORY, data.Items);
                commit(Mutations.SET_NETWORK_ADAPTER_TOTAL_ITEMS, data.Total);
                resolve(data);
            }, reject);
        });
    },
    [Actions.FETCH_INCIDENT_CRITICALITY_DIC]({ commit }) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetIncidentCriticalityDictionary", "Directories"), {}, data => {
                commit(Mutations.SET_INCIDENT_CRITICALITY_DICTIONARY, data);
                resolve(data);
            }, reject);
        });
    },
    [Actions.STORE_INCIDENT_CRITICALITY]({ commit }, model) {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateCriticality", "Directories"), model, resolve, reject);
        });
    },
    [Actions.FETCH_EQUIPMENT_LOG_SEVERITY]({ commit }) {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetEquipmentLogsSeverity", "Directories"), {}, data => {
                commit(Mutations.SET_EQUIPMENT_LOG_SEVERITY, data);
                resolve(data);
            }, reject);
        });
    },
};
function performRequest(commit, url, data, resolve, reject) {
    commit(Mutations.SET_IS_SAVING, true);
    Axios.post(url, data)
        .then((result) => {
        if (result.status === 200) {
            if (typeof result.data === "string") {
                reject(result.data);
            }
            else {
                resolve(result.data);
            }
        }
    })
        .catch((error) => {
        logError(error);
        reject(error);
    })
        .finally(() => {
        commit(Mutations.SET_IS_SAVING, false);
    });
}
function removeDirectory(url, id, resolve, reject) {
    Axios.post(url + "?id=" + id)
        .then((result) => {
        resolve(result.data);
    })
        .catch((error) => {
        logError(error);
        reject(error);
    });
}
function performGetRequest(commit, url, data, resolve, reject) {
    Axios.get(url, { params: data })
        .then((result) => {
        if (result.status === 200) {
            if (typeof result.data === "string") {
                reject(result.data);
            }
            else {
                resolve(result.data);
            }
        }
    })
        .catch((error) => {
        logError(error);
        reject(error);
    })
        .finally(() => {
    });
}
//# sourceMappingURL=actions.js.map