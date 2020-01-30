import { ITariff, ITariffFilter, ITariffsState } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: ITariffsState = {
    Tariffs: [],
    Filter: <ITariffFilter> {
        Page: 0,
        ItemsPerPage: 10
    },
    Total: 0,
    IsLoading: false,
    SelectedTariffId: null
};

export const tariffs: Module<ITariffsState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
