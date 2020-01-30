import { ActionTree, Commit } from "vuex";
import {
    IDictionaries,
    IEquipmentDirectory,
    IPlatformDirectory,
    ICPUDirectory,
    IRAMDirectory,
    IHDDDirectory,
    INetworkAdapterDirectory,
    ISoftwareDirectory,
    IOSDirectory,
    IDictionaryFilter,
    IObjectTypeDirectory,
    IObjectTypesFilter,
    IBranchDirectory,
    IBranchesFilter,
    IEquipmentTypesFilter,
    IAttackTypeDirectory,
    IAttackTypesFilter,
    IRaidDirectory,
    IOSFilter,
    IRaidFilter,
    ISoftwareFilter,
    IPlatformFilter,
    ICPUFilter,
    IHDDFilter,
    IRAMFilter,
    INetworkAdapterFilter,
    IIncidentCriticality,
    ISeveritySynonymsDirectory,
    ISeveritySynonymsFilter,
    ISeveritySynonymsEditModel
} from "./types";
import { IRootState } from "../../types";
import { Actions, Mutations } from "./constants";
import Axios from "axios";
import { urlHelper, logError } from "../../../Shared/utils";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";

export const actions: ActionTree<IDictionaries, IRootState> = {
    [Actions.STORE_EQUIPMENT_TYPE]({commit}: {commit: Commit}, model: IEquipmentDirectory): Promise<IEquipmentDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentType", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_EQUIPMENT_PLATFORM]({commit}: {commit: Commit}, model: IPlatformDirectory): Promise<IPlatformDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentPlatform", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_EQUIPMENT_PROCESSOR]({commit}: {commit: Commit}, model: ICPUDirectory): Promise<ICPUDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentProcessor", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_EQUIPMENT_MEMORY]({commit}: {commit: Commit}, model: IRAMDirectory): Promise<IRAMDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentMemory", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_EQUIPMENT_HDD]({commit}: {commit: Commit}, model: IHDDDirectory): Promise<IHDDDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentHDD", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_EQUIPMENT_NETWORK_ADAPTER]({commit}: {commit: Commit},
                                              model: INetworkAdapterDirectory): Promise<INetworkAdapterDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentNetworkAdapter", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_EQUIPMENT_SOFTWARE]({commit}: {commit: Commit}, model: ISoftwareDirectory): Promise<ISoftwareDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentSoftware", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_EQUIPMENT_OS]({commit}: {commit: Commit}, model: IOSDirectory): Promise<IOSDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateEquipmentOS", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_OBJECT_TYPE]({commit}: {commit: Commit}, model: IObjectTypeDirectory): Promise<IObjectTypeDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateObjectType", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_BRANCH]({commit}: {commit: Commit}, model: IBranchDirectory): Promise<IBranchDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateBranch", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_ATTACK_TYPE]({commit}: {commit: Commit}, model: IAttackTypeDirectory): Promise<IAttackTypeDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateAttackType", "Directories"), model, resolve, reject);
        });
    },

    [Actions.STORE_RAID]({commit}: {commit: Commit}, model: IRaidDirectory): Promise<IRaidDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateRaid", "Directories"), model, resolve, reject);
        });
    },

    [Actions.REMOVE_OBJECT_TYPE]({commit}: {commit: Commit}, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveObjectType", "Directories"), id, resolve, reject);
            //performRequest(commit, urlHelper("RemoveObjectType", "Directories") + "?id=" + id, null, resolve, reject);
        });
    },

    [Actions.REMOVE_EQUIPMENT_TYPE]({commit}: {commit: Commit}, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveEquipmentType", "Directories"), id, resolve, reject);
            //performRequest(commit, urlHelper("RemoveObjectType", "Directories") + "?id=" + id, null, resolve, reject);
        });
    },

    [Actions.REMOVE_BRANCH]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveBranch", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_ATTACK_TYPE]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveAttackType", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_RAID]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveRaid", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_OS]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveOS", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_SOFTWARE]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveSoftware", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_PLATFORM]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemovePlatform", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_CPU]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveProcessor", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_HDD]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveHDD", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_RAM]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveRAM", "Directories"), id, resolve, reject);
        });
    },

    [Actions.REMOVE_NETWORK_ADAPTER]({ commit }: { commit: Commit }, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            removeDirectory(urlHelper("RemoveNetworkAdapter", "Directories"), id, resolve, reject);
        });
    },

    [Actions.FETCH_OBJECT_TYPES_DIRECTORY]({ commit }: { commit: Commit }, filter: IObjectTypesFilter): Promise<Array<IObjectTypeDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetObjectTypes", "Directories"), filter,
                data => {
                    commit(Mutations.SET_OBJECT_TYPES_DIRECTORY, data.Items);
                    commit(Mutations.SET_OBJECT_TYPES_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_BRANCHES_DIRECTORY]({ commit }: { commit: Commit }, filter: IBranchesFilter): Promise<Array<IBranchDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetBranches", "Directories"), filter,
                data => {
                    commit(Mutations.SET_BRANCHES_DIRECTORY, data.Items);
                    commit(Mutations.SET_BRANCHES_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_EQUIPMENT_TYPE_DIRECTORY]({ commit }: { commit: Commit }, filter: IEquipmentTypesFilter): Promise<Array<IEquipmentDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetEquipmentTypes", "Directories"), filter,
                data => {
                    commit(Mutations.SET_EQUIPMENT_TYPES_DIRECTORY, data.Items);
                    commit(Mutations.SET_EQUIPMENT_TYPES_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_ATTACK_TYPE_DIRECTORY]({ commit }: { commit: Commit }, filter: IAttackTypesFilter): Promise<Array<IAttackTypeDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetAttackTypes", "Directories"), filter,
                data => {
                    commit(Mutations.SET_ATTACK_TYPES_DIRECTORY, data.Items);
                    commit(Mutations.SET_ATTACK_TYPES_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_RAID]({ commit }: { commit: Commit }, filter: IRaidFilter): Promise<Array<IRaidDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetRaid", "Directories"), filter,
                data => {
                    commit(Mutations.SET_RAID_DIRECTORY, data.Items);
                    commit(Mutations.SET_RAID_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_OS]({ commit }: { commit: Commit }, filter: IOSFilter): Promise<Array<IOSDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetOS", "Directories"), filter,
                data => {
                    commit(Mutations.SET_OS_DIRECTORY, data.Items);
                    commit(Mutations.SET_OS_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_SOFTWARE]({ commit }: { commit: Commit }, filter: ISoftwareFilter): Promise<Array<ISoftwareDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetSoftware", "Directories"), filter,
                data => {
                    commit(Mutations.SET_SOFTWARE_DIRECTORY, data.Items);
                    commit(Mutations.SET_SOFTWARE_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_PLATFORM]({ commit }: { commit: Commit }, filter: IPlatformFilter): Promise<Array<IPlatformDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetPlatforms", "Directories"), filter,
                data => {
                    commit(Mutations.SET_PLATFORM_DIRECTORY, data.Items);
                    commit(Mutations.SET_PLATFORM_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_CPU]({ commit }: { commit: Commit }, filter: ICPUFilter): Promise<Array<ICPUDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetProcessors", "Directories"), filter,
                data => {
                    commit(Mutations.SET_CPU_DIRECTORY, data.Items);
                    commit(Mutations.SET_CPU_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_HDD]({ commit }: { commit: Commit }, filter: IHDDFilter): Promise<Array<IHDDDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetHDD", "Directories"), filter,
                data => {
                    commit(Mutations.SET_HDD_DIRECTORY, data.Items);
                    commit(Mutations.SET_HDD_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_RAM]({ commit }: { commit: Commit }, filter: IRAMFilter): Promise<Array<IRAMDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetRAM", "Directories"), filter,
                data => {
                    commit(Mutations.SET_RAM_DIRECTORY, data.Items);
                    commit(Mutations.SET_RAM_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_NETWORK_ADAPTER]({ commit }: { commit: Commit }, filter: INetworkAdapterFilter): Promise<Array<INetworkAdapterDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetNetworkAdapters", "Directories"), filter,
                data => {
                    commit(Mutations.SET_NETWORK_ADAPTER_DIRECTORY, data.Items);
                    commit(Mutations.SET_NETWORK_ADAPTER_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_NETWORK_ADAPTER]({ commit }: { commit: Commit }, filter: INetworkAdapterFilter): Promise<Array<INetworkAdapterDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetNetworkAdapters", "Directories"), filter,
                data => {
                    commit(Mutations.SET_NETWORK_ADAPTER_DIRECTORY, data.Items);
                    commit(Mutations.SET_NETWORK_ADAPTER_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_INCIDENT_CRITICALITY_DIC]({ commit }: { commit: Commit }): Promise<Array<IDictionaryItem>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetIncidentCriticalityDictionary", "Directories"), {},
                data => {
                    commit(Mutations.SET_INCIDENT_CRITICALITY_DICTIONARY, data);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.STORE_INCIDENT_CRITICALITY]({ commit }: { commit: Commit }, model: IIncidentCriticality): Promise<IIncidentCriticality | string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateCriticality", "Directories"), model, resolve, reject);
        });
    },

    [Actions.FETCH_EQUIPMENT_LOG_SEVERITY]({ commit }: { commit: Commit }): Promise<IDictionaryItem[]> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetEquipmentLogsSeverity", "Directories"), {},
                data => {
                    commit(Mutations.SET_EQUIPMENT_LOG_SEVERITY, data);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.FETCH_SEVERITY_SYNONYMS]({ commit }: { commit: Commit }, filter: ISeveritySynonymsFilter): Promise<Array<ISeveritySynonymsDirectory>> {
        return new Promise((resolve, reject) => {
            performGetRequest(commit, urlHelper("GetSeveritySynonyms", "Directories"), filter,
                data => {
                    commit(Mutations.SET_SEVERITY_SYNONYMS_DIRECTORY, data.Items);
                    commit(Mutations.SET_SEVERITY_SYNONYMS_TOTAL_ITEMS, data.Total);
                    resolve(data);
                },
                reject);
        });
    },

    [Actions.STORE_SEVERITY_SYNONYM]({ commit }: { commit: Commit }, editModel: ISeveritySynonymsEditModel): Promise<ISeveritySynonymsDirectory|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateSeveritySynonym", "Directories"), editModel, resolve, reject);
        });
    },

    [Actions.REMOVE_SEVERITY_SYNONYM]({ commit }: { commit: Commit }, severitySynonym: ISeveritySynonymsDirectory): Promise<void> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("RemoveSeveritySynonym", "Directories"), severitySynonym, resolve, reject);
        });
    },

    [Actions.STORE_SEVERITY]({ commit }: { commit: Commit }, model: { Title: string }): Promise<IDictionaryItem|string> {
        return new Promise((resolve, reject) => {
            performRequest(commit, urlHelper("CreateSeverity", "Directories"), model, resolve, reject);
        });
    },


};

function performRequest(commit: Commit, url: string, data: object | null, resolve: (data: any) => void, reject: (data: any) => void): void {
    commit(Mutations.SET_IS_SAVING, true);
    Axios.post(url, data)
    .then((result) => {
        if (result.status === 200) {
            if (typeof result.data === "string") {
                reject(result.data);
            } else {
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

function removeDirectory(url: string, id: number, resolve: (data: any) => void, reject: (data: any) => void): void {
    Axios.post(url + "?id=" + id)
        .then((result) => {
            resolve(result.data);
        })
        .catch((error) => {
            logError(error);
            reject(error);
        });
}

function performGetRequest(commit: Commit, url: string, data: object, resolve: (data: any) => void, reject: (data: any) => void): void {
    Axios.get(url, {params: data})
    .then((result) => {
        if (result.status === 200) {
            if (typeof result.data === "string") {
                reject(result.data);
            } else {
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


