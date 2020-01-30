import { MutationTree } from "vuex";
import { IVulnerabilities, IVulnerabilityFolder, IVulnerability, IFilter } from "./types";
import { Mutations } from "./constants";
import { IDictionaryItem } from "../Inventory/types";

export const mutations: MutationTree<IVulnerabilities> = {

    [Mutations.SET_FOLDERS](state: IVulnerabilities, payload: IVulnerabilityFolder[]) {
        state.Folders = payload;
    },

    [Mutations.SET_FOLDERS_ARE_LOADING](state: IVulnerabilities, payload: boolean) {
        state.Loading.AreFoldersLoading = payload;
    },

    [Mutations.SET_VULNERABILITIES](state: IVulnerabilities, payload: IVulnerability[]) {
        state.Vulnerabilities = payload;
    },

    [Mutations.SET_VULNERABILITIES_ARE_LOADING](state: IVulnerabilities, payload: boolean) {
        state.Loading.AreVulnerabilitiesLoading = payload;
    },

    [Mutations.SET_VULNERABILITY](state: IVulnerabilities, payload: IVulnerability|null) {
        state.SelectedVulnerability = payload;
    },

    [Mutations.SET_VULNERABILITY_IS_LOADING](state: IVulnerabilities, payload: boolean) {
        state.Loading.IsVulnerabilityLoading = payload;
    },

    [Mutations.SET_FILTER](state: IVulnerabilities, payload: IFilter) {
        state.Filter = payload;
    },

    [Mutations.SET_DICTIONARIES_ARE_LOADING](state: IVulnerabilities, payload: boolean) {
        state.Loading.DictionariesLoading = payload;
    },

    [Mutations.SET_DICTIONARIES](state: IVulnerabilities, payload: IDictionaryItem[]) {
        payload.forEach(x => x.Key = x.Value);

        const dictionaries = {
            Countries: payload.filter(x => x.Data === "Country"),
            Regulations: payload.filter(x => x.Data === "Regulations"),
            Manufacturers: payload.filter(x => x.Data === "Manufacturer"),
            Incidents: payload.filter(x => x.Data === "Incidents"),
            Resources: payload.filter(x => x.Data === "Resources"),
            Research: payload.filter(x => x.Data === "Research")
        };
        state.Dictionaries = dictionaries;
    },

    [Mutations.SET_COMMENTS_ARE_LOADING](state: IVulnerabilities, payload: boolean) {
        state.Loading.CommentsLoading = payload;
    },

    [Mutations.SET_COMMENT_IS_SAVING](state: IVulnerabilities, payload: boolean) {
        state.Loading.CommentStoring = payload;
    },

    [Mutations.SET_STATUS_IS_SAVING](state: IVulnerabilities, payload: boolean) {
        state.Loading.StatusStoring = payload;
    },

    [Mutations.SET_FOLDER_CONTENTS_LOADING](state: IVulnerabilities, payload: boolean) {
        state.Loading.FolderContentsLoading = payload;
    }
};
