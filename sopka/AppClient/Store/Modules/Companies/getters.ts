import { GetterTree } from "vuex";
import { IRootState } from "../../types";
import { ICompanyListItem, ICompaniesState, ICompanyFilter } from "./types";
import { Getters } from "./constants";

export const getters: GetterTree<ICompaniesState, IRootState> = {
    [Getters.COMPANIES_LIST](state: ICompaniesState): ICompanyListItem[] {
        return state.CompaniesList;
    },

    [Getters.FILTER](state: ICompaniesState): ICompanyFilter {
        return state.Filter;
    },

    [Getters.IS_LOADING](state: ICompaniesState): boolean {
        return state.IsLoading;
    },

    [Getters.TOTAL](state: ICompaniesState): number {
        return state.Total;
    },
}