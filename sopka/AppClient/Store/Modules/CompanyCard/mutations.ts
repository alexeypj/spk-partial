import { MutationTree } from "vuex";
import { Mutations } from "./constants";
import { ICompanyCardState, ICompanyCard, ITariff } from "./types";
import moment from "moment";

export const mutations: MutationTree<ICompanyCardState> = {

    [Mutations.SET_IS_LOADING](state: ICompanyCardState, isLoading: boolean): void {
        state.IsLoading = isLoading;
    },

    [Mutations.SET_COMPANY_INFO](state: ICompanyCardState, card: ICompanyCard): void {
        card.CompanyInfo.CreateDateFormatted = moment(card.CompanyInfo.CreateDate).format("DD.MM.YYYY");
        card.CompanyInfo.PaidText = card.CompanyInfo.Paid ? "Да" : "Нет";
        card.CompanyInfo.PaidToFormatted = card.CompanyInfo.PaidTo ? moment(card.CompanyInfo.PaidTo).format("DD.MM.YYYY") : "";
        state.CompanyCard = card;
    },

    [Mutations.SET_TARIFFS](state: ICompanyCardState, tariffs: ITariff[]): void {
        state.Tariffs = tariffs;
    }
}