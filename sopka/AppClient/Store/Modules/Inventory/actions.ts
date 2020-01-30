import { ActionTree, Commit, Dispatch } from "vuex";
import { IInventoryState, IObjectEntry, IInventoryFilter, IEquipment, IEquipmentListFilter, IDevice, IEquipmentListItem, ISummary } from "./types";
import { IRootState } from "../../types";
import { Actions, Mutations } from "./constants";
import { urlHelper, logError } from "../../../Shared/utils";
import Axios from "axios";

export const actions: ActionTree<IInventoryState, IRootState> = {
    [Actions.FETCH_OBJECT_LIST]({ commit }: {commit: Commit}, filter?: IInventoryFilter): Promise<IObjectEntry[]> {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_LIST_IS_LOADING, true);
            Axios.get(urlHelper("GetObjects", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                    SearchString: filter !== undefined ? filter.SearchString : null,
                    Page: filter !== undefined ? filter.Page : null
                }
            }).then((result) => {
                if(result.status === 200) {
                    commit(Mutations.SET_OBJECT_LIST, result.data);
                    resolve(result.data);
                } else {
                    logError(result.data);
                    reject(result.data);
                }
            }).catch(error => {
                logError(error);
                reject(error);
            }).finally(() => {
                commit(Mutations.SET_LIST_IS_LOADING, false);
            });
        });
     },

     [Actions.STORE_OBJECT]({ commit }: {commit: Commit}, model: IObjectEntry): Promise<IObjectEntry|Array<string>> {
        return new Promise((resolve, reject) => {
            if(model != null) {
                commit(Mutations.SET_IS_OBJECT_SAVING, true);
                Axios.post(urlHelper("Store", "Inventory"), model)
                .then(result => {
                    if(result.status === 200) {
                        resolve(result.data);
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    logError(error);
                    reject(error);
                })
                .finally(() => {
                    commit(Mutations.SET_IS_OBJECT_SAVING, false);
                });
            }
        });
    },

    [Actions.FETCH_EQUIPMENT_LIST]({ commit }: {commit: Commit}, filter: IEquipmentListFilter): Promise<Array<IEquipmentListItem>> {
        return new Promise((resolve, reject) => {
            if(filter != null) {
                commit(Mutations.SET_IS_CONTENT_LOADING, true);
                Axios.get(urlHelper("GetEquipmentList", "Inventory"), {
                    params: {
                        _: new Date().getTime(),
                        ...filter
                    }})
                    .then(result => {
                        if(result.status === 200) {
                            commit(Mutations.SET_EQUIPMENT_LIST, result.data.Items);
                            commit(Mutations.SET_EQUIPMENT_TOTAL_ITEMS, result.data.Total);
                            commit(Mutations.SET_EQUIPMENT_FILTER, filter);
                            resolve(result.data);
                        } else {
                            logError(result.data);
                            reject(result.data);
                        }
                    })
                    .catch(error => {
                        logError(error);
                        reject(error);
                    })
                    .finally(() => {
                        commit(Mutations.SET_IS_CONTENT_LOADING, false);
                    });
                }
        });
    },

    [Actions.FETCH_DEVICE_DICTIONARIES]({ commit }: {commit: Commit}): Promise<Array<IObjectEntry>> {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("LoadDictionaries", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                }
            }).then(result => {
                if(result.status === 200) {
                    commit(Mutations.SET_DEVICE_DICTIONARIES, result.data);
                    resolve(result.data);
                } else {
                    logError(result.data);
                    reject(result.data);
                }
            }).catch(error => {
                logError(error);
                reject(error);
            }).finally(() => {
                commit(Mutations.SET_IS_CONTENT_LOADING, false);
            });
        });
     },

     [Actions.FETCH_OBJECT_DICTIONARIES]({ commit }: {commit: Commit}): Promise<void> {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("LoadObjectDictionaries", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                }
            }).then(result => {
                if(result.status === 200) {
                    commit(Mutations.SET_OBJECT_DICTIONARIES, result.data);
                    resolve(result.data);
                } else {
                    logError(result.data);
                    reject(result.data);
                }
            }).catch(error => {
                logError(error);
                reject(error);
            }).finally(() => {
                commit(Mutations.SET_IS_CONTENT_LOADING, false);
            });
        });
     },

     [Actions.FETCH_DEVICE]({ commit }: {commit: Commit}, id: number): Promise<IDevice> {
         return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("GetDevice", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                    id: id
                }
            }).then(result => {
                if(result.status === 200) {
                    commit(Mutations.SET_DEVICE, result.data);
                    resolve(result.data);
                } else {
                    logError(result.data);
                    reject(result.data);
                }
            }).catch(error => {
                logError(error);
                reject(error);
            }).finally(() => {
                commit(Mutations.SET_IS_CONTENT_LOADING, false);
            });
         });
     },

     [Actions.FETCH_EQUIPMENT]({ commit }: {commit: Commit}, id: number): Promise<IEquipment> {
        return new Promise((resolve, reject) => {
           commit(Mutations.SET_IS_CONTENT_LOADING, true);
           Axios.get(urlHelper("GetEquipment", "Inventory"), {
               params: {
                   _: new Date().getTime(),
                   id: id
               }
           }).then(result => {
               if(result.status === 200) {
                   commit(Mutations.SET_EQUIPMENT, result.data);
                   resolve(result.data);
               } else {
                   logError(result.data);
                   reject(result.data);
               }
           }).catch(error => {
               logError(error);
               reject(error);
           }).finally(() => {
               commit(Mutations.SET_IS_CONTENT_LOADING, false);
           });
        });
    },

     [Actions.STORE_EQUIPMENT]({ commit }: {commit: Commit}, model: IEquipment): Promise<IEquipment|Array<string>> {
         return new Promise((resolve, reject) => {
            if(model != null) {
                commit(Mutations.SET_IS_OBJECT_SAVING, true);
                Axios.post(urlHelper("StoreEquipment", "Inventory"), model)
                .then(result => {
                    if(result.status === 200) {
                        resolve(result.data);
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    logError(error);
                    reject(error);
                })
                .finally(() => {
                    commit(Mutations.SET_IS_OBJECT_SAVING, false);
                });
            }
         });
     },

     [Actions.REMOVE_EQUIPMENT]({ commit }: { commit: Commit }, id: number): Promise<void> {
         return new Promise((resolve, reject) => {
                commit(Mutations.SET_IS_OBJECT_SAVING, true);
                Axios.post(urlHelper("Remove/" + id, "Equipment"))
                .then(result => {
                    if(result.status === 200) {
                        return resolve();
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    logError(error);
                    reject(error);
                })
                .finally(() => {
                    commit(Mutations.SET_IS_OBJECT_SAVING, false);
                });
         });
     },

     [Actions.STORE_DEVICE]({ commit }: {commit: Commit}, model: IDevice): Promise<IDevice|Array<string>> {
        return new Promise((resolve, reject) => {
           if(model != null) {
               commit(Mutations.SET_IS_OBJECT_SAVING, true);
               Axios.post(urlHelper("StoreDevice", "Inventory"), model)
               .then(result => {
                   if(result.status === 200) {
                       resolve(result.data);
                   } else {
                       logError(result.data);
                       reject(result.data);
                   }
               })
               .catch(error => {
                   logError(error);
                   reject(error);
               })
               .finally(() => {
                   commit(Mutations.SET_IS_OBJECT_SAVING, false);
               });
           }
        });
    },

    [Actions.FETCH_OBJECT]({ commit }: {commit: Commit}, id: number): Promise<IObjectEntry> {
        return new Promise((resolve, reject) => {
           commit(Mutations.SET_IS_CONTENT_LOADING, true);
           Axios.get(urlHelper("GetObject", "Inventory"), {
               params: {
                   _: new Date().getTime(),
                   id: id
               }
           }).then(result => {
               if(result.status === 200) {
                   commit(Mutations.SET_OBJECT, result.data);
                   resolve(result.data);
               } else {
                   logError(result.data);
                   reject(result.data);
               }
           }).catch(error => {
               logError(error);
               reject(error);
           }).finally(() => {
               commit(Mutations.SET_IS_CONTENT_LOADING, false);
           });
        });
    },

    [Actions.REMOVE_OBJECT]({ commit }: {commit: Commit}, id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.post(urlHelper("RemoveObject/" + id, "Inventory"))
             .then((result) => {
                if (result.status === 200) {
                    if (typeof result.data === "string") {
                        reject(result.data);
                    } else {
                        resolve(result.data);
                    }
                } else {
                    logError(result.data);
                    reject(result.data);
                }
            }).catch((error) => {
                logError(error);
                reject(error);
            }).finally(() => {
                commit(Mutations.SET_IS_CONTENT_LOADING, false);
            });
         });
    },

    async [Actions.FETCH_SUMMARY]({ commit }: { commit: Commit}): Promise<ISummary> {
        commit(Mutations.SET_IS_CONTENT_LOADING, true);
        try {
            const result = await Axios.get(urlHelper("Data", "Home"), {
                params: {
                    _: new Date().getTime()
                }
            });
            return result.data;
        } finally {
            commit(Mutations.SET_IS_CONTENT_LOADING, false);
        }
    }
};
