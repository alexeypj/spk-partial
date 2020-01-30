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
    [Actions.FETCH_DICTIONARIES_FOR_CREATION]({ commit }) {
        return new Promise((resolve, reject) => {
            Axios.get("/Incident/IncidentCreationDictionaries")
                .then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_DICTIONARIES_FOR_CREATION, result.data);
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
            });
        });
    },
    [Actions.FETCH_DICTIONARIES_FOR_FILTER]({ commit }) {
        return new Promise((resolve, reject) => {
            Axios.get("/incident/dictionaries")
                .then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_DICTIONARIES_FOR_FILTER, result.data);
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
            });
        });
    },
    [Actions.FETCH_INCIDENTS]({ commit }, filter) {
        return new Promise((resolve, reject) => {
            Axios.get("/Incident/List", {
                params: Object.assign({ _: new Date().getTime() }, filter)
            })
                .then(result => {
                if (result.status === 200) {
                    commit(Mutations.SET_INCIDENTS, result.data.Items);
                    commit(Mutations.SET_INCIDENTS_TOTAL_ITEMS, result.data.Total);
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
            });
        });
    },
    [Actions.SAVE_INCIDENT]({ commit }, { incident, removedFiles }) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("Id", incident.Id.toString());
            data.append("AttackType", incident.AttackType.toString() || "");
            if (incident.Title) {
                data.append("Title", incident.Title);
            }
            if (incident.FixationTime) {
                if (typeof (incident.FixationTime) === "object") {
                    data.append("FixationTime", incident.FixationTime.toString());
                }
                else {
                    data.append("FixationTime", incident.FixationTime);
                }
            }
            if (incident.DecisionTime) {
                if (typeof (incident.DecisionTime) === "object") {
                    data.append("FixationTime", incident.DecisionTime.toString());
                }
                else {
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
                .catch(error => {
                commit(Mutations.SET_IS_INCIDENT_SAVING, false);
                logError(error);
                reject(error);
            });
        });
    },
    [Actions.FETCH_INCIDENT]({ commit }, id) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_INCIDENT_LOADING, true);
            Axios.get(urlHelper("Get", "Incident"), { params: {
                    _: new Date().getTime(),
                    id
                } })
                .then(result => {
                commit(Mutations.SET_IS_INCIDENT_LOADING, false);
                if (result.status === 200) {
                    if (typeof result.data === "string") {
                        reject(result.data);
                    }
                    else {
                        commit(Mutations.SET_INCIDENT, result.data);
                        resolve(result.data);
                    }
                }
                else {
                    logError(result.data);
                    reject(result.data);
                }
            })
                .catch(error => {
                commit(Mutations.SET_IS_INCIDENT_LOADING, false);
                logError(error);
                reject(error);
            });
        });
    },
    [Actions.FETCH_STATUSES]({ commit }) {
        return new Promise((resolve, reject) => {
            Axios.get(urlHelper("Statuses", "Incident"), { params: {
                    _: new Date().getTime()
                } })
                .then(result => {
                if (result.status === 200) {
                    if (typeof result.data === "string") {
                        reject(result.data);
                    }
                    else {
                        commit(Mutations.SET_STATUSES, result.data);
                        resolve(result.data);
                    }
                }
                else {
                    logError(result.data);
                    reject(result.data);
                }
            })
                .catch(error => {
                logError(error);
                reject(error);
            });
        });
    },
    [Actions.SET_STATUS]({ commit }, { incidentId, statusId, comment }) {
        return new Promise((resolve, reject) => {
            commit(Mutations.SET_IS_LOADING, true);
            Axios.post(urlHelper("SetStatus", "Incident"), { incidentId, statusId, comment })
                .then(result => {
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
                .catch(error => {
                logError(error);
                reject(error);
            })
                .finally(() => {
                commit(Mutations.SET_IS_LOADING, false);
            });
        });
    },
    [Actions.FETCH_HISTORY]({ commit }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Axios.get(urlHelper("History", "Incident"), { params: {
                    _: new Date().getTime(),
                    id
                } });
            if (result.status === 200) {
                if (typeof result.data === "string") {
                    throw new Error(result.data);
                }
                else {
                    return result.data;
                }
            }
            else {
                logError(result.data);
                throw new Error(result.data);
            }
        });
    },
    [Actions.FETCH_RELATED_ARTICLES]({ commit }, { incidentId, excludeArticles }) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_RELATED_ARTICLES_LOADING, true);
            const result = yield Axios.get(urlHelper("RelatedArticles", "KnowledgeBase"), { params: {
                    _: new Date().getTime(),
                    incidentId,
                    excludeArticles: JSON.stringify(excludeArticles)
                } });
            commit(Mutations.SET_IS_RELATED_ARTICLES_LOADING, false);
            if (result.status === 200) {
                if (typeof result.data === "string") {
                    throw new Error(result.data);
                }
                else {
                    return result.data;
                }
            }
            else {
                logError(result.data);
                throw new Error(result.data);
            }
        });
    },
    [Actions.FETCH_ARTICLE_PREVIEW]({ commit }, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_ARTICLE_PREVIEW_LOADING, true);
            const result = yield Axios.get(urlHelper("Preview", "KnowledgeBase"), { params: {
                    _: new Date().getTime(),
                    id: articleId
                } });
            commit(Mutations.SET_IS_ARTICLE_PREVIEW_LOADING, false);
            if (result.status === 200) {
                if (typeof result.data === "string") {
                    throw new Error(result.data);
                }
                else {
                    return result.data;
                }
            }
            else {
                logError(result.data);
                throw new Error(result.data);
            }
        });
    },
    [Actions.ATTACH_ARTICLE_TO_INCIDENT]({ commit }, { articleId, incidentId }) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_ARTICLE_ATTACHING, true);
            const result = yield Axios.post(urlHelper("AttachIncident", "KnowledgeBase"), {
                ArticleId: articleId,
                IncidentId: incidentId
            });
            commit(Mutations.SET_IS_ARTICLE_ATTACHING, false);
            if (result.status === 200) {
                if (typeof result.data === "string") {
                    throw new Error(result.data);
                }
                else {
                    return result.data;
                }
            }
            else {
                logError(result.data);
                throw new Error(result.data);
            }
        });
    },
    [Actions.DETACH_ARTICLE_FROM_INCIDENT]({ commit }, { articleId, incidentId }) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_ARTICLE_ATTACHING, true);
            const result = yield Axios.post(urlHelper("DetachIncident", "KnowledgeBase"), {
                ArticleId: articleId,
                IncidentId: incidentId
            });
            commit(Mutations.SET_IS_ARTICLE_ATTACHING, false);
            if (result.status === 200) {
                if (typeof result.data === "string") {
                    throw new Error(result.data);
                }
                else {
                    return result.data;
                }
            }
            else {
                logError(result.data);
                throw new Error(result.data);
            }
        });
    },
    [Actions.FETCH_ATTACHED_ARTICLES]({ commit }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Axios.get(urlHelper("AttachedArticles", "KnowledgeBase"), {
                params: {
                    id
                }
            });
            if (result.status === 200) {
                if (typeof result.data === "string") {
                    throw new Error(result.data);
                }
                else {
                    return result.data;
                }
            }
            else {
                logError(result.data);
                throw new Error(result.data);
            }
        });
    }
};
//# sourceMappingURL=actions.js.map