import { GetDefaultFilter } from "./types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
export const state = {
    CreationDictionaries: {
        Equipments: [],
        Attacks: [],
        Incidents: [],
        Countries: [],
        Platforms: [],
        Objects: [],
        Roles: [],
        Users: []
    },
    FilterDictionaries: {
        Attacks: [],
        Equipments: [],
        Objects: [],
        Platforms: [],
        Roles: [],
        Users: []
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
export const incident = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map