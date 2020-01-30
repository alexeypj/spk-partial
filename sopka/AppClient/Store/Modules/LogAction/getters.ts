import { GetterTree } from "vuex";
import { IRootState } from "../../types";
import { ILogActionState, ILogActionDictionaries, ILogAction, ILogActionFilter, GetDefaultFilter } from "./types"
import { Getters } from "./constants";

export const getters: GetterTree<ILogActionState, IRootState> = {
    [Getters.LOGS](state: ILogActionState): ILogAction[] {
        return state.Logs;
    },

    [Getters.DICTIONARIES](state: ILogActionState): ILogActionDictionaries {
        return state.Dics;
    },

    [Getters.LOGS_TOTAL_COUNT](state: ILogActionState): number {
        return state.Total;
    },

    [Getters.FILTER](state: ILogActionState): ILogActionFilter {
        return state.Filter;
    },

    [Getters.GET_NEW_FILTER](state: ILogActionState): ILogActionFilter {
        return GetDefaultFilter();
    },

    [Getters.GET_SELECTED_LOG](state: ILogActionState): ILogAction | null {
        return state.SelectedLog;
    },
}
