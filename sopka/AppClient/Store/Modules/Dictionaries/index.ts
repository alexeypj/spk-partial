import { IDictionaries, DictionariesTab, IObjectTypeDirectory, IDictionaryFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

const filter = <IDictionaryFilter> {
    Page: 1,
    ItemsPerPage: 20,
    SortColumn: "Id",
    Query: "",
    SortDirection: "ASC"
};

export const state: IDictionaries = {
    IsSaving: false,
    CurrentTab: DictionariesTab.ObjectTypes,
    Dictionaries: [],
    ObjectTypesState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    BranchesState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    EquipmentTypesState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    AttackTypesState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0,
    },
    RaidState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    OSState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    SoftwareState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    PlatformState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    CPUState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    HDDState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    RAMState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    NetworkAdaptersState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    SeveritySynonymsState: {
        Filter: { ...filter },
        Items: [],
        TotalItems: 0
    },
    IncidentCriticalityDictionary: [],
    EquipmentLogSeverity: []
};

export const dictionaries: Module<IDictionaries, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
