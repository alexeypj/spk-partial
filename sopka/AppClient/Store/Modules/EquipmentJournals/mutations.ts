import { Mutations } from "./constants";
import { MutationTree } from "vuex";
import { IEquipmentJournalState, IEquipmentJournalFilter, IEquipmentJournalItem, IEquipmentJournalDictionaries } from "./types";

export const mutations: MutationTree<IEquipmentJournalState> = {
    [Mutations.SET_IS_LOADING](state: IEquipmentJournalState, payload: boolean): void {
        state.IsLoading = payload;
    },

    [Mutations.SET_DICTIONARIES](state: IEquipmentJournalState, payload: IEquipmentJournalDictionaries): void {
        state.Dictionaries = payload;
    },

    [Mutations.SET_JOURNAL_LIST](state: IEquipmentJournalState, payload: IEquipmentJournalItem[]): void {
        state.Items = payload;
    },

    [Mutations.SET_JOURNAL_TOTAL_ITEMS](state: IEquipmentJournalState, payload: number): void {
        state.TotalItems = payload;
    },

    [Mutations.SET_FILTER](state: IEquipmentJournalState, payload: IEquipmentJournalFilter): void {
        state.Filter = payload;
    },
}
