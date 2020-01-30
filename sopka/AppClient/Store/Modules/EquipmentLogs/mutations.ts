import { MutationTree } from "vuex";
import { IEquipmentLogsState, IRule, IEquipmentLogsFilter } from "./types";
import { Mutations } from "./constants";

export const mutations: MutationTree<IEquipmentLogsState> = {

    [Mutations.SET_IS_LIST_LOADING](state: IEquipmentLogsState, payload: boolean): void {
        state.Loading.IsLoading = payload;
    },

    [Mutations.SET_LIST](state: IEquipmentLogsState, payload: {Items: IRule[], Total: number}): void {
        state.RulesList = payload.Items;
        state.RulesCount = payload.Total;
    },

    [Mutations.SET_IS_RULE_SAVING](state: IEquipmentLogsState, payload: boolean): void {
        state.Loading.IsSaving = payload;
    },

    [Mutations.SET_FILTER](state: IEquipmentLogsState, payload: IEquipmentLogsFilter): void {
        state.Filter = payload;
    },

    [Mutations.SET_IS_LOADING](state: IEquipmentLogsState, payload: boolean): void {
        state.Loading.IsLoading = payload;
    }
};
