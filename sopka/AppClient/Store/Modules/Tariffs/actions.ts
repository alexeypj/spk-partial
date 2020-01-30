import { ActionTree, Commit } from "vuex";
import { IRootState } from "../../types";
import { ITariff, ITariffFilter, ITariffsState } from "./types";
import { Actions, Mutations } from "./constants";
import Axios from "axios";
import { urlHelper, logError } from "../../../Shared/utils";

export const actions: ActionTree<ITariffsState, IRootState> = {

    [Actions.FETCH_TARIFFS_LIST]({ commit }: { commit: Commit }, filter: ITariffFilter): Promise<ITariff[]> {
        return new Promise((resolve, reject) => {
            if (filter != null) {
                commit(Mutations.SET_IS_LOADING, true);
                Axios.get(urlHelper("ListFiltered", "Tariffs"), {
                    params: {
                        _: new Date().getTime(),
                        ...filter
                    }})
                    .then((result) => {
                        if (result.status === 200) {
                            if (typeof result.data === "string") {
                                reject(result.data);
                            } else {
                                commit(Mutations.SET_TARIFFS, result.data.Items);
                                commit(Mutations.SET_TARIFFS_TOTAL, result.data.Total);
                                resolve(result.data);
                            }
                        } else {
                            logError(result.data);
                            reject(result.data);
                        }
                    })
                    .catch((error) => {
                        logError(error);
                        reject(error);
                    })
                    .finally(() => {
                        commit(Mutations.SET_IS_LOADING, false);
                    });
                }
        });
    },

    [Actions.STORE_TARIFF]({ commit }: { commit: Commit }, tariff: ITariff): Promise<ITariff|string> {
        return new Promise((resolve, reject) => {
            if (tariff != null) {
                commit(Mutations.SET_IS_LOADING, true);
                Axios.post(urlHelper("Store", "Tariffs"), tariff)
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
                    })
                    .catch((error) => {
                        logError(error);
                        reject(error);
                    })
                    .finally(() => {
                        commit(Mutations.SET_IS_LOADING, false);
                    });
                }
            });
    },

    [Actions.REMOVE_TARIFF]({ commit }: { commit: Commit }, tariffId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.post(urlHelper("RemoveTariff", "Tariffs") + "?id=" + tariffId)
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
                })
                .catch((error) => {
                    logError(error);
                    reject(error);
                })
                .finally(() => {
                    commit(Mutations.SET_IS_LOADING, false);
                });
        });
    }

};
