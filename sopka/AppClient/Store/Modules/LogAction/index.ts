import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
import { ILogActionState, GetDefaultFilter } from "./types";


const namespaced: boolean = true;

export const state: ILogActionState = {
    Logs: [],
    Total: 0,
    IsLoading: false,
    Filter: GetDefaultFilter(),
    Dics: {
        Actions:[],
        Users: [],
        ActionTypes: [],
        EntityTypes: []
    },
    SelectedLog: null
};

export const logAction: Module<ILogActionState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
