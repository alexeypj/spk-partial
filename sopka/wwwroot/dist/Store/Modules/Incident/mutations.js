import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_DICTIONARIES_FOR_CREATION](state, dictionaries) {
        state.CreationDictionaries = dictionaries;
    },
    [Mutations.SET_DICTIONARIES_FOR_FILTER](state, dictionaries) {
        state.FilterDictionaries = dictionaries;
    },
    [Mutations.SET_FILTER](state, newFilter) {
        state.Filter = newFilter;
    },
    [Mutations.SET_INCIDENTS](state, incidents) {
        state.IncidentList = incidents;
    },
    [Mutations.SET_INCIDENT](state, incident) {
        state.Incident = incident;
    },
    [Mutations.SET_STATUSES](state, statuses) {
        state.Statuses = statuses;
    },
    [Mutations.SET_IS_LOADING](state, value) {
        state.Loading.IsLoading = value;
    },
    [Mutations.SET_INCIDENTS_TOTAL_ITEMS](state, total) {
        state.IncidentListTotalItems = total;
    },
    [Mutations.SET_IS_RELATED_ARTICLES_LOADING](state, value) {
        state.Loading.IsRelatedArticlesLoading = value;
    },
    [Mutations.SET_IS_ARTICLE_PREVIEW_LOADING](state, value) {
        state.Loading.IsArticlePreviewLoading = value;
    },
    [Mutations.SET_IS_ARTICLE_ATTACHING](state, value) {
        state.Loading.IsArticleAttaching = value;
    },
    [Mutations.SET_IS_INCIDENT_LOADING](state, value) {
        state.Loading.IsIncidentLoading = value;
    },
    [Mutations.SET_IS_INCIDENT_SAVING](state, value) {
        state.Loading.IsIncidentSaving = value;
    },
};
//# sourceMappingURL=mutations.js.map