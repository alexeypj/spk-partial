import { ActionTree, Commit } from "vuex";
import { IRootState } from "../../types";
import { Actions, Mutations } from "./constants";
import Axios from "axios";
import { urlHelper, logError } from "../../../Shared/utils";
import { IKnowledgeBase, IFolder, IKnowledgeBaseDictionaries, IArticle, IIncidentArticle, IKnowledgeBaseFilter } from "./types";
import { IFile } from "../Common/types";

export const actions: ActionTree<IKnowledgeBase, IRootState> = {

    async [Actions.STORE_FOLDER]({ commit }: { commit: Commit}, model: IFolder): Promise<IFolder> {
        try {
            if (model !== null) {
                commit(Mutations.SET_IS_LOADING, true);
                const response = await Axios.post(urlHelper("StoreFolder", "KnowledgeBase"), model);

                commit(Mutations.SET_IS_LOADING, false);
                if (response.status === 200) {
                    if (typeof response.data === "string") {
                        throw response.data;
                    } else {
                       return response.data;
                    }
                } else {
                    throw response.data;
                }
            }
            throw new Error("Model is null");
        } catch (ex) {
            commit(Mutations.SET_IS_LOADING, false);
            logError(ex);
            throw ex;
        }

    },

    async [Actions.FETCH_FOLDERS]({ commit }: { commit: Commit}): Promise<IFolder[]> {
        commit(Mutations.SET_IS_LOADING, true);
        const response = await Axios.get(urlHelper("Folders", "KnowledgeBase"), { params: {
            _: new Date().getTime()
        }});

        commit(Mutations.SET_IS_LOADING, false);
        if (response.status === 200) {
            commit(Mutations.SET_FOLDER, response.data);
            return response.data;
        } else {
            throw response.data;
        }
    },

    async [Actions.FETCH_DICTIONARIES]({ commit }: { commit: Commit}): Promise<IKnowledgeBaseDictionaries[]> {
        commit(Mutations.SET_IS_LOADING, true);
        const response = await Axios.get(urlHelper("Dictionaries", "KnowledgeBase"), { params: {
            _: new Date().getTime()
        }});

        commit(Mutations.SET_IS_LOADING, false);
        if (response.status === 200) {
            if (typeof response.data === "string") {
                throw response.data;
            } else {
                commit(Mutations.SET_DICTIONARIES, response.data);
                return response.data;
            }
        } else {
            throw response.data;
        }
    },

    async [Actions.STORE_ARTICLE]({ commit }: { commit: Commit}, { model, removedFiles, importedFiles }:
                                                { model: IArticle, removedFiles: IFile[], importedFiles: IFile[] }): Promise<IArticle> {
        if (model == null) {
            throw new Error("Article is is null");
        }

        commit(Mutations.SET_IS_LOADING, true);
        const data = new FormData();
        data.append("Id", model.Id!.toString());
        data.append("Title", model.Title || "");
        data.append("IdFolder", (model.IdFolder) ? model.IdFolder.toString() : "0");
        data.append("Description", model.Description || "");
        data.append("Solution", model.Solution || "");
        if (removedFiles && removedFiles.length > 0) {
            removedFiles.map(x => {
                data.append("RemovedFiles[]", x.Id.toString());
            });
        }
        if (importedFiles && importedFiles.length > 0) {
            importedFiles.map(x => {
                data.append("ImportedFiles[]", x.Id.toString());
            });
        }

        if (model.AttackTypeTags) {
            model.AttackTypeTags.map(tag => data.append("AttackTypeTags[]", tag.toString()));
        }
        if (model.EquipmentTypeTags) {
            model.EquipmentTypeTags.map(tag => data.append("EquipmentTypeTags[]", tag.toString()));
        }
        if (model.PlatformTags) {
            model.PlatformTags.map(tag => data.append("PlatformTags[]", tag.toString()));
        }
        if (model.MemoryTags) {
            model.MemoryTags.map(tag => data.append("MemoryTags[]", tag.toString()));
        }
        if (model.CPUTags) {
            model.CPUTags.map(tag => data.append("CPUTags[]", tag.toString()));
        }
        if (model.RaidTags) {
            model.RaidTags.map(tag => data.append("RaidTags[]", tag.toString()));
        }
        if (model.HddTags) {
            model.HddTags.map(tag => data.append("HddTags[]", tag.toString()));
        }
        if (model.NetworkAdapterTags) {
            model.NetworkAdapterTags.map(tag => data.append("NetworkAdapterTags[]", tag.toString()));
        }
        if (model.SoftwareTags) {
            model.SoftwareTags.map(tag => data.append("SoftwareTags[]", tag.toString()));
        }
        if (model.OSTags) {
            model.OSTags.map(tag => data.append("OSTags[]", tag.toString()));
        }

        if (model.Files && model.Files.length > 0) {
            model.Files.map(file => {
                data.append("Files", file, file.name);
            });
        }

        if (model.BaseIncidentId) {
            data.append("BaseIncidentId", model.BaseIncidentId.toString());
        }
        try {
            const response = await Axios.post(urlHelper("Store", "KnowledgeBase"), data);
            if (response.status === 200) {
                if (response.status === 200) {
                    if (typeof response.data === "string") {
                        throw response.data;
                    } else {
                    return response.data;
                    }
                } else {
                    throw response.data;
                }
            } else {
                logError(response.data);
                throw response.data;
            }
        } catch (ex) {
            logError(ex.response.data);
            throw ex.response.data;
        } finally {
            commit(Mutations.SET_IS_LOADING, false);
        }

    },

    async [Actions.FETCH_ARTICLES]({ commit }: { commit: Commit}, filter: IKnowledgeBaseFilter): Promise<IArticle[]> {
        commit(Mutations.SET_IS_LOADING, true);
        const response = await Axios.get(urlHelper("ArticlesList", "KnowledgeBase"), { params: {
            _: new Date().getTime(),
            ... filter
        }});

        commit(Mutations.SET_IS_LOADING, false);
        if (response.status === 200) {
            if (typeof response.data === "string") {
                throw response.data;
            } else {
                commit(Mutations.SET_ARTICLES, response.data);
                return response.data;
            }
        } else {
            throw response.data;
        }
    },

    async [Actions.FETCH_ARTICLE]({ commit }: { commit: Commit}, id: number): Promise<IArticle> {
        commit(Mutations.SET_IS_LOADING, true);
        const response = await Axios.get(urlHelper("GetArticle/" + id , "KnowledgeBase"), { params: {
            _: new Date().getTime()
        }});

        commit(Mutations.SET_IS_LOADING, false);
        if (response.status === 200) {
            if (typeof response.data === "string") {
                throw response.data;
            } else {
                return response.data;
            }
        } else {
            throw response.data;
        }
    },

    async [Actions.FETCH_ATTACHED_INCIDENTS]({ commit }: { commit: Commit}, id: number): Promise<IIncidentArticle[]> {
        const result = await Axios.get(urlHelper("AttachedIncidents", "KnowledgeBase"), {
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

    async [Actions.REMOVE_ARTICLE]({ commit }: { commit: Commit}, id: number): Promise<boolean> {

        commit(Mutations.SET_IS_LOADING, true);

        try {
            const result = await Axios.post(urlHelper("Remove/" + id, "KnowledgeBase"));
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
        }  catch (ex) {
            logError(ex.response.data);
            throw ex.response.data;
        } finally {
            commit(Mutations.SET_IS_LOADING, false);
        }

    },
};
