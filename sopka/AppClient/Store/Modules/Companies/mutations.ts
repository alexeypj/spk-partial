import { MutationTree } from "vuex";
import { Mutations } from "./constants";
import { ICompaniesState, ICompanyListItem, ICompanyFilter } from "./types";
import moment from "moment";

export const mutations: MutationTree<ICompaniesState> = {

    [Mutations.SET_IS_LIST_LOADING](state: ICompaniesState, isLoading: boolean): void {
        state.IsLoading = isLoading;
    },

    [Mutations.SET_COMPANIES_LIST](state: ICompaniesState, list: ICompanyListItem[]): void {
        list.forEach(x => {
            x.CreateDateFormatted = moment(x.CreateDate).format("DD.MM.YYYY");
            x.PaidToFormatted = x.PaidTo && moment(x.PaidTo).format("DD.MM.YYYY") || "";
            x.PaidText = x.Paid ? "Да" : "Нет";
        });
        state.CompaniesList = list;
    },


    [Mutations.SET_COMPANIES_TOTAL](state: ICompaniesState, total: number): void {
        state.Total = total;
    },

    [Mutations.SET_FILTER](state: ICompaniesState, filter: ICompanyFilter): void {
        state.Filter = filter;
    }
}