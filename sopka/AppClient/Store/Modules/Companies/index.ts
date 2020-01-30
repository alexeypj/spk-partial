import { ICompaniesState, createFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: ICompaniesState = {
    CompaniesList: [],
    IsLoading: false,
    Filter: createFilter(),
    Total: 0,
};

export const companies: Module<ICompaniesState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
