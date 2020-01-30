var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Actions, Mutations } from "./constants";
import { urlHelper, logError } from "../../../Shared/utils";
import Axios from "axios";
export const actions = {
    [Actions.FETCH_OBJECT_LIST]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_LIST_IS_LOADING, true);
            Axios.get(urlHelper("GetObjects", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                    SearchString: filter !== undefined ? filter.SearchString : null,
                    Page: filter !== undefined ? filter.Page : null
                }
            }).then((result) => {
                if (result.status === 200) {
                    commit(Mutations.SET_OBJECT_LIST, result.data);
                    resolve(result.data);
                }
                else {
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
    [Actions.STORE_OBJECT]({ commit }, model) {
        return new Promise((resolve, reject) => {
            if (model != null) {
                commit(Mutations.SET_IS_OBJECT_SAVING, true);
                Axios.post(urlHelper("Store", "Inventory"), model)
                    .then(result => {
                    if (result.status === 200) {
                        resolve(result.data);
                    }
                    else {
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
    [Actions.FETCH_EQUIPMENT_LIST]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            if (filter != null) {
                commit(Mutations.SET_IS_CONTENT_LOADING, true);
                Axios.get(urlHelper("GetEquipmentList", "Inventory"), {
                    params: Object.assign({ _: new Date().getTime() }, filter)
                })
                    .then(result => {
                    if (result.status === 200) {
                        commit(Mutations.SET_EQUIPMENT_LIST, result.data.Items);
                        commit(Mutations.SET_EQUIPMENT_TOTAL_ITEMS, result.data.Total);
                        commit(Mutations.SET_EQUIPMENT_FILTER, filter);
                        resolve(result.data);
                    }
                    else {
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
    [Actions.FETCH_DEVICE_DICTIONARIES]({ commit }) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("LoadDictionaries", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                }
            }).then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_DEVICE_DICTIONARIES, result.data);
                    resolve(result.data);
                }
                else {
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
    [Actions.FETCH_OBJECT_DICTIONARIES]({ commit }) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("LoadObjectDictionaries", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                }
            }).then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_OBJECT_DICTIONARIES, result.data);
                    resolve(result.data);
                }
                else {
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
    [Actions.FETCH_DEVICE]({ commit }, id) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("GetDevice", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                    id: id
                }
            }).then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_DEVICE, result.data);
                    resolve(result.data);
                }
                else {
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
    [Actions.FETCH_EQUIPMENT]({ commit }, id) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("GetEquipment", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                    id: id
                }
            }).then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_EQUIPMENT, result.data);
                    resolve(result.data);
                }
                else {
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
    [Actions.STORE_EQUIPMENT]({ commit }, model) {
        return new Promise((resolve, reject) => {
            if (model != null) {
                commit(Mutations.SET_IS_OBJECT_SAVING, true);
                Axios.post(urlHelper("StoreEquipment", "Inventory"), model)
                    .then(result => {
                    if (result.status === 200) {
                        resolve(result.data);
                    }
                    else {
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
    [Actions.REMOVE_EQUIPMENT]({ commit }, id) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_OBJECT_SAVING, true);
            Axios.post(urlHelper("RemoveEquipment/" + id, "Inventory"))
                .then(result => {
                if (result.status === 200) {
                    return resolve();
                }
                else {
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
    [Actions.STORE_DEVICE]({ commit }, model) {
        return new Promise((resolve, reject) => {
            if (model != null) {
                commit(Mutations.SET_IS_OBJECT_SAVING, true);
                Axios.post(urlHelper("StoreDevice", "Inventory"), model)
                    .then(result => {
                    if (result.status === 200) {
                        resolve(result.data);
                    }
                    else {
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
    [Actions.FETCH_OBJECT]({ commit }, id) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.get(urlHelper("GetObject", "Inventory"), {
                params: {
                    _: new Date().getTime(),
                    id: id
                }
            }).then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_OBJECT, result.data);
                    resolve(result.data);
                }
                else {
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
    [Actions.REMOVE_OBJECT]({ commit }, id) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            Axios.post(urlHelper("RemoveObject/" + id, "Inventory"))
                .then((result) => {
                if (result.status === 200) {
                    if (typeof result.data === "string") {
                        reject(result.data);
                    }
                    else {
                        resolve(result.data);
                    }
                }
                else {
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
    [Actions.FETCH_SUMMARY]({ commit }) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_CONTENT_LOADING, true);
            try {
                const result = yield Axios.get(urlHelper("Data", "Home"), {
                    params: {
                        _: new Date().getTime()
                    }
                });
                return result.data;
            }
            finally {
                commit(Mutations.SET_IS_CONTENT_LOADING, false);
            }
        });
    }
};
//# sourceMappingURL=actions.js.map