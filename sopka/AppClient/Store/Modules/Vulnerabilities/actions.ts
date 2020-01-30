import { ActionTree, Commit } from "vuex";
import { IRootState } from "../../types";
import { IVulnerabilities, IFilter, IVulnerability, IVulnerabilityFolder, IVulnerabilityComment } from "./types";
import { Actions, Mutations } from "./constants";
import Axios from "axios";
import { urlHelper } from "../../../Shared/utils";
import { IDictionaryItem } from "../Inventory/types";

export const actions: ActionTree<IVulnerabilities, IRootState> = {

    async [Actions.FETCH_FOLDERS]({ commit }: { commit: Commit }): Promise<IVulnerabilityFolder[]> {
        commit(Mutations.SET_FOLDERS_ARE_LOADING, true);
        const response = await Axios.get(urlHelper("GetFolders", "Vulnerabilities"), { params: {
            _: new Date().getTime()
        }});
        commit(Mutations.SET_FOLDERS_ARE_LOADING, false);

        if (response.status === 200) {
            if (typeof response.data === "string") {
                throw response.data;
            } else {
                commit(Mutations.SET_FOLDERS, response.data);
                return response.data;
            }
        } else {
            throw response.data;
        }
    },

    async [Actions.FETCH_VULNERABILITIES]({ commit }: {commit: Commit}, filter: IFilter): Promise<IVulnerability[]> {
        commit(Mutations.SET_VULNERABILITIES_ARE_LOADING, true);
        const filterObj: any =  {};
        if (filter.Countries && filter.Countries.length > 0) {
            filterObj.Countries = filter.Countries.join(",");
        }
        if (filter.Incidents && filter.Incidents.length > 0) {
            filterObj.Incidents = filter.Incidents.join(",");
        }
        if (filter.Manufacturers && filter.Manufacturers.length > 0) {
            filterObj.Manufacturers = filter.Manufacturers.join(",");
        }
        if (filter.Regulations && filter.Regulations.length > 0) {
            filterObj.Regulations = filter.Regulations.join(",");
        }
        if (filter.Research && filter.Research.length > 0) {
            filterObj.Research = filter.Research.join(",")
        }
        if (filter.Resources && filter.Resources.length > 0) {
            filterObj.Resources = filter.Resources.join(",");
        }
        if (filter.Status) {
            filterObj.StatusId = filter.Status;
        }
        if (filter.UseCreateDate) {
            filterObj.UseCreateDate = filter.UseCreateDate;
            filterObj.CreateDateFrom = filter.CreateDateFrom;
            filterObj.CreateDateTo = filter.CreateDateTo;
        }

        const response = await Axios.get(urlHelper("List", "Vulnerabilities"), { params: {
            _: new Date().getTime(),
            ... filterObj
        }});
        commit(Mutations.SET_VULNERABILITIES_ARE_LOADING, false);

        if (response.status === 200) {
            if (typeof response.data === "string") {
                throw response.data;
            } else {
                commit(Mutations.SET_VULNERABILITIES, response.data);
                return response.data;
            }
        } else {
            throw response.data;
        }
    },

    async [Actions.FETCH_VULNERABILITY]({ commit }: {commit: Commit}, id: number): Promise<IVulnerability> {
        commit(Mutations.SET_VULNERABILITY, true);
        const response = await Axios.get(urlHelper("Get", "Vulnerabilities"), { params: {
            _: new Date().getTime(),
            id
        }});
        commit(Mutations.SET_VULNERABILITY, false);

        if (response.status === 200) {
            if (typeof response.data === "string") {
                throw response.data;
            } else {
                commit(Mutations.SET_VULNERABILITY, response.data);
                return response.data;
            }
        } else {
            throw response.data;
        }
    },

    async [Actions.FETCH_DICTIONARIES]({ commit }: {commit: Commit}): Promise<IDictionaryItem[]> {
        commit(Mutations.SET_DICTIONARIES_ARE_LOADING, true);
        const response = await Axios.get(urlHelper("Dictionaries", "Vulnerabilities"), { params: {
            _: new Date().getTime()
        }});
        commit(Mutations.SET_DICTIONARIES_ARE_LOADING, false);

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

    async [Actions.FETCH_COMMENTS]( { commit }: {commit: Commit}, id: number): Promise<IVulnerabilityComment[]> {
        commit(Mutations.SET_COMMENTS_ARE_LOADING, true);
        const response = await Axios.get(urlHelper("Comments/?id=" + id, "Vulnerabilities"), { params: {
            _: new Date().getTime()
        }});
        commit(Mutations.SET_COMMENTS_ARE_LOADING, false);

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

    async [Actions.STORE_COMMENT]( { commit }: {commit: Commit}, {id, text}: {id: number, text: string }): Promise<number> {
        commit(Mutations.SET_COMMENT_IS_SAVING, true);
        const response = await Axios.post(urlHelper("StoreComment", "Vulnerabilities"), {
            id,
            text
        });
        commit(Mutations.SET_COMMENT_IS_SAVING, false);

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

    async [Actions.SET_STATUS]( { commit }: {commit: Commit}, {id, statusId}: {id: number, statusId: number }): Promise<number> {
        commit(Mutations.SET_STATUS_IS_SAVING, true);
        const response = await Axios.post(urlHelper("SetStatus", "Vulnerabilities"), {
            id,
            statusId: Number(statusId)
        });
        commit(Mutations.SET_STATUS_IS_SAVING, false);

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

    async [Actions.FETCH_FOLDER_CONTENTS]( { commit }: {commit: Commit}, id: number): Promise<IVulnerabilities> {
        commit(Mutations.SET_FOLDER_CONTENTS_LOADING, true);
        const response = await Axios.get(urlHelper("FolderContents/?id=" + id, "Vulnerabilities"), { params: {
            _: new Date().getTime()
        }});
        commit(Mutations.SET_FOLDER_CONTENTS_LOADING, false);

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
};
