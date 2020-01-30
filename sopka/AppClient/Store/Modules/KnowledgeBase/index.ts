import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
import { IKnowledgeBase, GetDefaultFilter } from "./types";

const namespaced: boolean = true;

export const state: IKnowledgeBase = {
    IsLoading: false,
    Folders: [],
    Articles: [],
    ArticleFiles: [],
    Dictionaries: {
        Objects: [],
        CPU: [],
        Memory: [],
        HDD: [],
        NetworkAdapters: [],
        OS: [],
        Software: [],
        Platforms: [],
        AttackTypes: [],
        DeviceTypes: [],
        RaidTypes: []
    },
    Filter: GetDefaultFilter()
};

export const knowledgeBase: Module<IKnowledgeBase, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
