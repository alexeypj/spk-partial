import { MutationTree } from "vuex";
import { ITariff, ITariffFilter, ITariffsState } from "./types";
import { Mutations } from "./constants";
import { IUser, IUserRole } from "../Common/types";

export const mutations: MutationTree<ITariffsState> = {

    [Mutations.SET_IS_LOADING](state: ITariffsState, value: boolean): void {
        state.IsLoading = value;
    },

    [Mutations.SET_TARIFFS](state: ITariffsState, tariffs: ITariff[]): void {
        state.Tariffs = tariffs;
    },

    [Mutations.SET_FILTER](state: ITariffsState, filter: ITariffFilter): void {
        state.Filter = filter;
    },

    [Mutations.SET_SELECTED_TARIFF_ID](state: ITariffsState, id?: number): void {
        state.SelectedTariffId = id !== undefined ? id : null;
    },


    [Mutations.SET_TARIFFS_TOTAL](state: ITariffsState, total: number): void {
        state.Total = total;
    }
};
