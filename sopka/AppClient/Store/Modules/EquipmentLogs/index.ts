import { IEquipmentLogsState, createFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: IEquipmentLogsState = {
    RulesList: [],
    RulesCount: 0,
    Loading: {
        IsOneLoading: false,
        IsLoading: false,
        IsSaving: false
    },
    Filter: createFilter()
};

export const equipmentLogs: Module<IEquipmentLogsState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
