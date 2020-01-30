import { Actions, Mutations } from "./constants";
import { urlHelper, logError } from "../../../Shared/utils";
import Axios from "axios";
export const actions = {
    [Actions.FETCH_EQUIPMENT_LIST]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            if (filter != null) {
                commit(Mutations.SET_IS_CONTENT_LOADING, true);
                Axios.get(urlHelper("Find", "Equipment"), {
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
    [Actions.FETCH_DICTIONARIES]({ commit }) {
        return new Promise((resolve, reject) => {
            Axios.get(urlHelper("GetDictionaries", "Equipment"), {
                params: {
                    _: new Date().getTime()
                }
            })
                .then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_EQUIPMENT_DICTIONARIES, result.data);
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
                // commit(Mutations.SET_IS_CONTENT_LOADING, false);
            });
        });
    },
    [Actions.APPLY_COLUMN_FILTER]({ commit }, columnFilters) {
        return new Promise((resolve, reject) => {
            if (columnFilters != null) {
                commit(Mutations.SET_IS_CONTENT_LOADING, true);
                const filters = {};
                columnFilters.map(x => filters[x.Name] = x.FilterValue);
                Axios.get(urlHelper("FindByColumn", "Equipment"), {
                    params: Object.assign({ _: new Date().getTime() }, filters)
                })
                    .then(result => {
                    if (result.status === 200) {
                        commit(Mutations.SET_EQUIPMENT_LIST, result.data.Items);
                        commit(Mutations.SET_EQUIPMENT_TOTAL_ITEMS, 0);
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
    }
};
//# sourceMappingURL=actions.js.map