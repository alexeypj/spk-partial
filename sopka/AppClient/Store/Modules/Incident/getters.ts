import { GetterTree } from "vuex";
import {
    IIncidentCreationState, IIncidentCreationDictionaries, IIncidentFilterDictionaries,
    IIncidentListItem, IIncidentListFilter, IIncidentStatus, GetDefaultFilter } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";

export const getters: GetterTree<IIncidentCreationState, IRootState> = {
    [Getters.GET_DICTIONARIES_FOR_CREATION](state: IIncidentCreationState): IIncidentCreationDictionaries {
      return state.CreationDictionaries;
    },
    [Getters.GET_DICTIONARIES_FOR_FILTER](state: IIncidentCreationState): IIncidentFilterDictionaries {
      return state.FilterDictionaries;
    },
    [Getters.GET_INCIDENTS](state: IIncidentCreationState): IIncidentListItem[] {
      return state.IncidentList;
    },
    [Getters.GET_NEW_FILTER](state: IIncidentCreationState): IIncidentListFilter {
      return GetDefaultFilter();
    },
    [Getters.GET_CURRENT_FILTER](state: IIncidentCreationState): IIncidentListFilter {
        return state.Filter;
    },

    [Getters.STATUSES](state: IIncidentCreationState): IIncidentStatus[] {
      return state.Statuses;
    },

    [Getters.GET_STATUS](state: IIncidentCreationState): (id: number) => IIncidentStatus | undefined {
      return (id: number) => state.Statuses.find(x => x.Id === id);
    },

    [Getters.IS_LOADING](state: IIncidentCreationState): boolean {
      return state.Loading.IsLoading;
    },

    [Getters.INCIDENTS](state: IIncidentCreationState): IIncidentListItem[] {
      return state.IncidentList;
    },

    [Getters.INCIDENTS_TOTAL_ITEMS](state: IIncidentCreationState): number {
      return state.IncidentListTotalItems;
    },

    [Getters.IS_RELATED_ARTICLES_LOADING](state: IIncidentCreationState): boolean {
      return state.Loading.IsRelatedArticlesLoading;
    },

    [Getters.IS_ARTICLE_PREVIEW_LOADING](state: IIncidentCreationState): boolean {
      return state.Loading.IsArticlePreviewLoading;
    },

    [Getters.IS_ARTICLE_ATTACHING](state: IIncidentCreationState): boolean {
      return state.Loading.IsArticleAttaching;
    },

    [Getters.IS_INCIDENT_LOADING](state: IIncidentCreationState): boolean {
      return state.Loading.IsIncidentLoading;
    },

    [Getters.IS_INCIDENT_SAVING](state: IIncidentCreationState): boolean {
      return state.Loading.IsIncidentSaving;
    },
};
