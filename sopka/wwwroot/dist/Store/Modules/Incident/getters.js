import { GetDefaultFilter } from "./types";
import { Getters } from "./constants";
export const getters = {
    [Getters.GET_DICTIONARIES_FOR_CREATION](state) {
        return state.CreationDictionaries;
    },
    [Getters.GET_DICTIONARIES_FOR_FILTER](state) {
        return state.FilterDictionaries;
    },
    [Getters.GET_INCIDENTS](state) {
        return state.IncidentList;
    },
    [Getters.GET_NEW_FILTER](state) {
        return GetDefaultFilter();
    },
    [Getters.GET_CURRENT_FILTER](state) {
        return state.Filter;
    },
    [Getters.STATUSES](state) {
        return state.Statuses;
    },
    [Getters.GET_STATUS](state) {
        return (id) => state.Statuses.find(x => x.Id === id);
    },
    [Getters.IS_LOADING](state) {
        return state.Loading.IsLoading;
    },
    [Getters.INCIDENTS](state) {
        return state.IncidentList;
    },
    [Getters.INCIDENTS_TOTAL_ITEMS](state) {
        return state.IncidentListTotalItems;
    },
    [Getters.IS_RELATED_ARTICLES_LOADING](state) {
        return state.Loading.IsRelatedArticlesLoading;
    },
    [Getters.IS_ARTICLE_PREVIEW_LOADING](state) {
        return state.Loading.IsArticlePreviewLoading;
    },
    [Getters.IS_ARTICLE_ATTACHING](state) {
        return state.Loading.IsArticleAttaching;
    },
    [Getters.IS_INCIDENT_LOADING](state) {
        return state.Loading.IsIncidentLoading;
    },
    [Getters.IS_INCIDENT_SAVING](state) {
        return state.Loading.IsIncidentSaving;
    },
};
//# sourceMappingURL=getters.js.map