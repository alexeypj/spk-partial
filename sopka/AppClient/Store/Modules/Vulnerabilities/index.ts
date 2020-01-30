import { IVulnerabilities, createFilter, } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: IVulnerabilities = {
    Filter: createFilter(),
    Folders: [],
    Vulnerabilities: [],
    SelectedVulnerability: null,
    Dictionaries: {
        Countries: [],
        Regulations: [],
        Manufacturers: [],
        Incidents: [],
        Resources: [],
        Research: [],
    },
    Loading: {
        AreFoldersLoading: false,
        AreVulnerabilitiesLoading: false,
        IsVulnerabilityLoading: false,
        DictionariesLoading: false,
        CommentsLoading: false,
        CommentStoring: false,
        StatusStoring: false,
        FolderContentsLoading: false
    }
};

export const vulnerabilities: Module<IVulnerabilities, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
