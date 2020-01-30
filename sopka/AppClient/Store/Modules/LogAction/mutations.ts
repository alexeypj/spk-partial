import { MutationTree } from "vuex";
import { ILogActionState, ILogActionDictionaries, ILogAction, ILogActionFilter } from "./types"
import { Mutations } from "./constants";

export const mutations: MutationTree<ILogActionState> = {

    [Mutations.SET_IS_LOADING](state: ILogActionState, value: boolean): void {
        state.IsLoading = value;
    },

    [Mutations.SET_DICTIONARIES](state: ILogActionState, dics: ILogActionDictionaries): void {
        state.Dics = dics;
    },

    [Mutations.SET_LOGS_TOTAL_COUNT](state: ILogActionState, total: number): void {
        state.Total = total;
    },

    [Mutations.SET_LOGS](state: ILogActionState, logs: ILogAction[]): void {
        state.Logs = logs;
    },

    [Mutations.SET_FILTER](state: ILogActionState, filter: ILogActionFilter): void {
        state.Filter = filter;
    },

    [Mutations.SET_SELECTED_LOG](state: ILogActionState, log: ILogAction | null): void {
        state.SelectedLog = log;
    },
}
