import { GetterTree } from "vuex";
import { IRootState } from "../../types";
import { ICompanyCardState, ICompanyCard, ITariff } from "./types";
import { Getters } from "./constants";

export const getters: GetterTree<ICompanyCardState, IRootState> = {
    [Getters.COMPANY_INFO](state: ICompanyCardState): ICompanyCard | null {
        return state.CompanyCard;
    },

    [Getters.IS_LOADING](state: ICompanyCardState): boolean {
        return state.IsLoading;
    },

    [Getters.TARIFFS](state: ICompanyCardState): ITariff[] {
        return state.Tariffs;
    }
}