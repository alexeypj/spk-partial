import { ActionTree, Commit, Dispatch} from "vuex";
import {
    IIncidentCreationState,
    IIncident,
    IIncidentListFilter,
    IIncidentStatus,
    IIncidentStatusHistory,
    IKnowledgeBaseIncidentMatch,
    IIncidentStatistic,
    IIncidentStatisticFilter,
    IIncidentHistoryFilter
} from "./types";
import { IRootState } from "../../types";
import { Actions, Mutations } from "./constants";
import { urlHelper, logError } from "../../../Shared/utils";
import Axios from "axios";
import { IFile } from "../Common/types";
import { IArticle, IIncidentArticle } from "../KnowledgeBase/types";

export const actions: ActionTree<IIncidentCreationState, IRootState> = {
    [Actions.FETCH_DICTIONARIES_FOR_CREATION]({ commit }: { commit: Commit }) {
        return new Promise((resolve, reject) => {
            Axios.get(urlHelper("IncidentCreationDictionaries", "Incident"))
                .then(result => {
                    if (result.status === 200) {
                        commit(Mutations.SET_DICTIONARIES_FOR_CREATION, result.data);
                        resolve(result.data);
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    logError(error.response.data);
                    reject(error.response.data);
                });
        });
    },
    [Actions.FETCH_DICTIONARIES_FOR_FILTER]({ commit }: { commit: Commit }) {
        return new Promise((resolve, reject) => {
            Axios.get(urlHelper("Dictionaries", "Incident"))
                .then(result => {
                    if (result.status === 200) {
                        commit(Mutations.SET_DICTIONARIES_FOR_FILTER, result.data);
                        resolve(result.data);
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    logError(error.response.data);
                    reject(error.response.data);
                });
        });
    },
    [Actions.FETCH_INCIDENTS]({ commit }: { commit: Commit }, filter: IIncidentListFilter) {
        return new Promise((resolve, reject) => {
            Axios.get(urlHelper("List", "Incident"), {
                params: {
                    _: new Date().getTime(),
                    ...filter
                }
            })
                .then(result => {
                    if (result.status === 200) {
                        commit(Mutations.SET_INCIDENTS, result.data.Items);
                        commit(Mutations.SET_INCIDENTS_TOTAL_ITEMS, result.data.Total);
                        resolve(result.data);
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    logError(error.response.data);
                    reject(error.response.data);
                });
        });
    },
    [Actions.SAVE_INCIDENT]({ commit }: { commit: Commit },
                            {incident, removedFiles }: {incident: IIncident, removedFiles: IFile[]}): Promise<number> {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("Id", incident.Id.toString());
            data.append("AttackType", incident.AttackType!.toString() || "");

            if (incident.Title) {
                data.append("Title", incident.Title);
            }
            if (incident.FixationTime) {
                if (typeof(incident.FixationTime) === "object") {
                    data.append("FixationTime", incident.FixationTime.toString());
                } else {
                    data.append("FixationTime", incident.FixationTime);
                }
            }
            if (incident.DecisionTime) {
                if (typeof(incident.DecisionTime) === "object") {
                    data.append("FixationTime", incident.DecisionTime.toString());
                } else {
                    data.append("DecisionTime", incident.DecisionTime);
                }
            }
            if (incident.Description) {
                data.append("Description", incident.Description);
            }
            if (incident.DetectionMethod) {
                data.append("DetectionMethod", incident.DetectionMethod);
            }
            if (incident.SourceIP) {
                data.append("SourceIP", incident.SourceIP);
            }
            if (incident.SourceURL) {
                data.append("SourceURL", incident.SourceURL);
            }
            if (incident.SourceCountry) {
                data.append("SourceCountry", incident.SourceCountry);
            }
            if (incident.SourceAddress) {
                data.append("SourceAddress", incident.SourceAddress);
            }
            if (incident.SourceEquipmentId) {
                data.append("SourceEquipmentId", incident.SourceEquipmentId.toString());
            }
            if (incident.RelatedIncidents) {
                incident.RelatedIncidents.map(x => data.append("RelatedIncidents", x.toString()));
            }
            if (incident.BlockingRecommendations) {
                data.append("BlockingRecommendations", incident.BlockingRecommendations);
            }
            if (incident.MitigationRecommendations) {
                data.append("MitigationRecommendations", incident.MitigationRecommendations);
            }
            if (incident.PreventionRecommendations) {
                data.append("PreventionRecommendations", incident.PreventionRecommendations);
            }

            if (incident.Criticality) {
                data.append("Criticality", incident.Criticality.toString());
            }

            if (incident.Files && incident.Files.length > 0) {
                incident.Files.map(file => {
                    data.append("Files", file, file.name);
                });
            }

            if (removedFiles && removedFiles.length > 0) {
                removedFiles.map(x => {
                    data.append("RemovedFiles", x.Id.toString());
                });
            }

            commit(Mutations.SET_IS_INCIDENT_SAVING, true);
            Axios.post(urlHelper("Store", "Incident"), data)
                .then(result => {
                    commit(Mutations.SET_IS_INCIDENT_SAVING, false);
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
                .catch(error => {
                    commit(Mutations.SET_IS_INCIDENT_SAVING, false);
                    logError(error.response.data);
                    reject(error.response.data);
                });
        });
    },

    [Actions.FETCH_INCIDENT]({ commit }: { commit: Commit }, id: number): Promise<IIncident> {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_INCIDENT_LOADING, true);
            Axios.get(urlHelper("Get", "Incident"), { params: {
                _: new Date().getTime(),
                id
            }})
                .then(result => {
                    commit(Mutations.SET_IS_INCIDENT_LOADING, false);
                    if (result.status === 200) {
                        if (typeof result.data === "string") {
                            reject(result.data);
                        } else {
                            commit(Mutations.SET_INCIDENT, result.data);
                            resolve(result.data);
                        }
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    commit(Mutations.SET_IS_INCIDENT_LOADING, false);
                    logError(error.response.data);
                    reject(error.response.data);
                });
        });
    },

    [Actions.FETCH_STATUSES]({ commit }: { commit: Commit}): Promise<IIncidentStatus[]> {
        return new Promise((resolve, reject) => {
            Axios.get(urlHelper("Statuses", "Incident"), { params: {
                _: new Date().getTime()
            }})
                .then(result => {
                    if (result.status === 200) {
                        if (typeof result.data === "string") {
                            reject(result.data);
                        } else {
                            commit(Mutations.SET_STATUSES, result.data);
                            resolve(result.data);
                        }
                    } else {
                        logError(result.data);
                        reject(result.data);
                    }
                })
                .catch(error => {
                    logError(error.response.data);
                    reject(error.response.data);
                });
        });
    },

    [Actions.SET_STATUS]({ commit }: { commit: Commit},
                         { incidentId, statusId, comment }: { incidentId: number, statusId: number, comment: string}): Promise<boolean> {

        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.post(urlHelper("SetStatus", "Incident"), { incidentId, statusId, comment })
                .then(result => {
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
                .catch(error => {
                    logError(error.response.data);
                    reject(error.response.data);
                })
                .finally(() => {
                    commit(Mutations.SET_IS_LOADING, false);
                });
        });
    },

    async [Actions.FETCH_HISTORY]({ commit }: { commit: Commit}, filter: IIncidentHistoryFilter): Promise<IIncidentStatusHistory[]> {
        const result = await Axios.get(urlHelper("History", "Incident"), { params: {
            _: new Date().getTime(),
            ...filter
        }});

        if (result.status === 200) {
            if (typeof result.data === "string") {
                throw new Error(result.data);
            } else {
                return result.data;
            }
        } else {
            logError(result.data);
            throw new Error(result.data);
        }
    },

    async [Actions.FETCH_RELATED_ARTICLES]({ commit }: { commit: Commit},
                                           { incidentId, excludeArticles }: {incidentId: number, excludeArticles: number[]}):
                                           Promise<IKnowledgeBaseIncidentMatch[]> {

        commit(Mutations.SET_IS_RELATED_ARTICLES_LOADING, true);
        const result = await Axios.get(urlHelper("RelatedArticles", "KnowledgeBase"), { params: {
            _: new Date().getTime(),
            incidentId,
            excludeArticles: JSON.stringify(excludeArticles)
        }});

        commit(Mutations.SET_IS_RELATED_ARTICLES_LOADING, false);

        if (result.status === 200) {
            if (typeof result.data === "string") {
                throw new Error(result.data);
            } else {
                return result.data;
            }
        } else {
            logError(result.data);
            throw new Error(result.data);
        }
    },

    async [Actions.FETCH_ARTICLE_PREVIEW]({ commit }: { commit: Commit }, articleId: number): Promise<IArticle> {
        commit(Mutations.SET_IS_ARTICLE_PREVIEW_LOADING, true);
        const result = await Axios.get(urlHelper("Preview", "KnowledgeBase"), { params: {
            _: new Date().getTime(),
            id: articleId
        }});

        commit(Mutations.SET_IS_ARTICLE_PREVIEW_LOADING, false);

        if (result.status === 200) {
            if (typeof result.data === "string") {
                throw new Error(result.data);
            } else {
                return result.data;
            }
        } else {
            logError(result.data);
            throw new Error(result.data);
        }
    },

    async [Actions.ATTACH_ARTICLE_TO_INCIDENT]({ commit }: { commit: Commit },
                                               { articleId, incidentId }: { articleId: number, incidentId: number }): Promise<boolean> {
        commit(Mutations.SET_IS_ARTICLE_ATTACHING, true);
        const result = await Axios.post(urlHelper("AttachIncident", "KnowledgeBase"), {
            ArticleId: articleId,
            IncidentId: incidentId
        });
        commit(Mutations.SET_IS_ARTICLE_ATTACHING, false);

        if (result.status === 200) {
            if (typeof result.data === "string") {
                throw new Error(result.data);
            } else {
                return result.data;
            }
        } else {
            logError(result.data);
            throw new Error(result.data);
        }
    },

    async [Actions.DETACH_ARTICLE_FROM_INCIDENT]({ commit }: { commit: Commit },
                                                 { articleId, incidentId }: { articleId: number, incidentId: number }): Promise<boolean> {
        commit(Mutations.SET_IS_ARTICLE_ATTACHING, true);
        const result = await Axios.post(urlHelper("DetachIncident", "KnowledgeBase"), {
            ArticleId: articleId,
            IncidentId: incidentId
        });
        commit(Mutations.SET_IS_ARTICLE_ATTACHING, false);

        if (result.status === 200) {
            if (typeof result.data === "string") {
                throw new Error(result.data);
            } else {
                return result.data;
            }
        } else {
            logError(result.data);
            throw new Error(result.data);
        }
    },

    async [Actions.FETCH_ATTACHED_ARTICLES]({ commit }: { commit: Commit}, id: number): Promise<IIncidentArticle[]> {
        const result = await Axios.get(urlHelper("AttachedArticles", "KnowledgeBase"), { 
            params: {
                id
            }
        });

        if (result.status === 200) {
            if (typeof result.data === "string") {
                throw new Error(result.data);
            } else {
                return result.data;
            }
        } else {
            logError(result.data);
            throw new Error(result.data);
        }
    },

    async [Actions.FETCH_STATISTICS]({ commit }: { commit: Commit }, filter: IIncidentStatisticFilter): Promise<IIncidentStatistic> {
        const result = await Axios.post(urlHelper("Statistic", "Incident"), filter);

        if (result.status === 200) {
            if (typeof result.data === "string") {
                throw new Error(result.data);
            } else {
                return result.data;
            }
        } else {
            logError(result.data);
            throw new Error(result.data);
        }
    }

};
