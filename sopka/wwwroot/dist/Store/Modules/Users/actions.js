import { Actions, Mutations } from "./constants";
import { User } from "../Common/types";
import Axios from "axios";
import { urlHelper, logError } from "../../../Shared/utils";
export const actions = {
    [Actions.FETCH_USER_LIST]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            if (filter != null) {
                commit(Mutations.SET_IS_LOADING, true);
                Axios.get(urlHelper("UserList", "Users"), {
                    params: Object.assign({ _: new Date().getTime() }, filter)
                })
                    .then((result) => {
                    if (result.status === 200) {
                        if (typeof result.data === "string") {
                            reject(result.data);
                        }
                        else {
                            commit(Mutations.SET_USERS, result.data.Items);
                            commit(Mutations.SET_USERS_TOTAL, result.data.Total);
                            resolve(result.data);
                        }
                    }
                    else {
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
    [Actions.FETCH_USER]({ commit }, id) {
        return new Promise((resolve, reject) => {
            if (id === "0") {
                return resolve(User.getDefault());
            }
            commit(Mutations.SET_IS_LOADING, true);
            Axios.get(urlHelper("Get", "Users"), {
                params: {
                    _: new Date().getTime(),
                    id
                }
            })
                .then((result) => {
                if (result.status === 200) {
                    resolve(result.data);
                }
                else {
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
    },
    [Actions.FETCH_ROLES]({ commit }) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.get(urlHelper("Roles", "Users"), {
                params: {
                    _: new Date().getTime()
                }
            })
                .then((result) => {
                if (result.status === 200) {
                    if (typeof result.data === "string") {
                        reject(result.data);
                    }
                    else {
                        commit(Mutations.SET_ROLES, result.data);
                        resolve(result.data);
                    }
                }
                else {
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
    },
    [Actions.STORE_USER]({ commit }, { user, roles }) {
        return new Promise((resolve, reject) => {
            if (user != null) {
                commit(Mutations.SET_IS_LOADING, true);
                Axios.post(urlHelper("Store", "Users"), Object.assign({}, user, { roles }))
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
    [Actions.GENERATE_PASSWORD]({ commit }) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.get(urlHelper("GeneratePassword", "Users"), { params: {
                    _: new Date().getTime()
                } })
                .then((result) => {
                if (result.status === 200) {
                    resolve(result.data);
                }
                else {
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
    },
    [Actions.UPDATE_PASSWORD]({ commit }, { userId, password }) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.post(urlHelper("UpdatePassword", "Users"), { userId, password })
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
            })
                .catch((error) => {
                logError(error);
                reject(error);
            })
                .finally(() => {
                commit(Mutations.SET_IS_LOADING, false);
            });
        });
    },
    [Actions.BLOCK_USER]({ commit }, { userId, reason }) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.post(urlHelper("BlockUser", "Users"), { userId, reason })
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
            })
                .catch((error) => {
                logError(error);
                reject(error);
            })
                .finally(() => {
                commit(Mutations.SET_IS_LOADING, false);
            });
        });
    },
    [Actions.UNBLOCK_USER]({ commit }, userId) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.post(urlHelper("UnblockUser", "Users"), { userId })
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
//# sourceMappingURL=actions.js.map