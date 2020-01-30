import { IEquipmentJournalState, createFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: IEquipmentJournalState = {
    Filter: createFilter(),
    Items: [],
    TotalItems: 0,
    Dictionaries: {
        Objects: [],
        EquipmentTypes: [],
        Platforms: [],
        Equipments: []
    },
    IsLoading: false
};

export const equipmentJournals: Module<IEquipmentJournalState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};

