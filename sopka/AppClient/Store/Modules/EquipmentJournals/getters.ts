import { GetterTree } from "vuex";
import { Getters } from "./constants";
import { IEquipmentJournalState, IEquipmentJournalFilter, IEquipmentJournalItem, IEquipmentJournalDictionaries, createFilter } from "./types";
import { IRootState } from "../../types";


export const getters: GetterTree<IEquipmentJournalState, IRootState> = {
  [Getters.CURRENT_FILTER](state: IEquipmentJournalState): IEquipmentJournalFilter {
    return state.Filter;
  },

  [Getters.NEW_FILTER](state: IEquipmentJournalState): IEquipmentJournalFilter {
    return createFilter();
  },

  [Getters.DICTIONARIES](state: IEquipmentJournalState): IEquipmentJournalDictionaries {
    return state.Dictionaries;
  },

  [Getters.IS_LOADING](state: IEquipmentJournalState): boolean {
    return state.IsLoading;
  },

  [Getters.JOURNAL_LIST](state: IEquipmentJournalState): IEquipmentJournalItem[] {
    return state.Items;
  },

  [Getters.JOURNAL_LIST_TOTAL](state: IEquipmentJournalState): number {
    return state.TotalItems;
  },
}
