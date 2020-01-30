import { ICompanyCardState, ICompanyCard } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: ICompanyCardState = {
    CompanyCard: null,
    IsLoading: false,
    Tariffs: []
};

export const companyCard: Module<ICompanyCardState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
