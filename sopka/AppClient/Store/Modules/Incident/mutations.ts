import { MutationTree } from "vuex";
import { IIncidentCreationState, IIncidentCreationDictionaries, IIncidentListFilter, IIncidentFilterDictionaries,
  IIncidentListItem,
  IIncident,
  IIncidentStatus
} from "./types";
import { Mutations } from "./constants";

export const mutations: MutationTree<IIncidentCreationState> = {
    [Mutations.SET_DICTIONARIES_FOR_CREATION](state: IIncidentCreationState, dictionaries: IIncidentCreationDictionaries): void {
        state.CreationDictionaries = dictionaries;
    },
    [Mutations.SET_DICTIONARIES_FOR_FILTER](state: IIncidentCreationState, dictionaries: IIncidentFilterDictionaries): void {
        state.FilterDictionaries = dictionaries;
    },
    [Mutations.SET_FILTER](state: IIncidentCreationState, newFilter: IIncidentListFilter): void {
        state.Filter = newFilter;
    },
    [Mutations.SET_INCIDENTS](state: IIncidentCreationState, incidents: IIncidentListItem[]): void {
        state.IncidentList = incidents;
    },

    [Mutations.SET_INCIDENT](state: IIncidentCreationState, incident: IIncident | null): void {
        state.Incident = incident;
    },

    [Mutations.SET_STATUSES](state: IIncidentCreationState, statuses: IIncidentStatus[]): void {
        state.Statuses = statuses;
    },

    [Mutations.SET_IS_LOADING](state: IIncidentCreationState, value: boolean): void {
        state.Loading.IsLoading = value;
    },

    [Mutations.SET_INCIDENTS_TOTAL_ITEMS](state: IIncidentCreationState, total: number): void {
        state.IncidentListTotalItems = total;
    },

    [Mutations.SET_IS_RELATED_ARTICLES_LOADING](state: IIncidentCreationState, value: boolean): void {
        state.Loading.IsRelatedArticlesLoading = value;
    },

    [Mutations.SET_IS_ARTICLE_PREVIEW_LOADING](state: IIncidentCreationState, value: boolean): void {
        state.Loading.IsArticlePreviewLoading = value;
    },

    [Mutations.SET_IS_ARTICLE_ATTACHING](state: IIncidentCreationState, value: boolean): void {
        state.Loading.IsArticleAttaching = value;
    },

    [Mutations.SET_IS_INCIDENT_LOADING](state: IIncidentCreationState, value: boolean): void {
        state.Loading.IsIncidentLoading = value;
    },

    [Mutations.SET_IS_INCIDENT_SAVING](state: IIncidentCreationState, value: boolean): void {
        state.Loading.IsIncidentSaving = value;
    },

};
