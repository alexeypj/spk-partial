import { IIncidentCreationState, GetDefaultFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: IIncidentCreationState = {
    CreationDictionaries: {
        Equipments: [],
        Attacks: [],
        Incidents: [],
        Countries: [],
        Platforms: [],
        Objects: [],
        Roles: [],
        Users: [],
        Severity: []
    },
    FilterDictionaries: {
        Attacks: [],
        Equipments: [],
        Objects: [],
        Platforms: [],
        Roles: [],
        Users: [],
        Countries: []
    },
    IncidentList: [],
    IncidentsTotal: 0,
    Filter: GetDefaultFilter(),
    IncidentListTotalItems: 0,
    Incident: null,
    Statuses: [],
    Loading: {
        IsLoading: false,
        IsRelatedArticlesLoading: false,
        IsArticlePreviewLoading: false,
        IsArticleAttaching: false,
        IsIncidentLoading: false,
        IsIncidentSaving: false
    }
};

export const incident: Module<IIncidentCreationState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
