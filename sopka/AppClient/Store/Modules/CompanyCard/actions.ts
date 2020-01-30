import { ActionTree, Commit } from "vuex";
import { Actions, Mutations } from "./constants";
import { ICompanyCardState, ICompanyCard, ITariff, ICompany } from "./types";
import { IRootState } from "../../../Store/types";
import { logError, urlHelper } from "../../../Shared/utils";
import Axios, { AxiosResponse } from "axios";


export const actions: ActionTree<ICompanyCardState, IRootState> = {
    async [Actions.FETCH_COMPANY_INFO]({ commit }: { commit: Commit }): Promise<ICompanyCard> {
        commit(Mutations.SET_IS_LOADING, true);
        const result = await Axios.get(urlHelper("Card", "Companies"), { params: {
            _: new Date().getTime()
        }});
        commit(Mutations.SET_IS_LOADING, false);
        handleResult(result);
        commit(Mutations.SET_COMPANY_INFO, result.data);
        return result.data;
    },

    async [Actions.FETCH_TARIFFS]({ commit }: { commit: Commit}): Promise<ITariff[]> {
        commit(Mutations.SET_IS_LOADING, true);
        const result = await Axios.get(urlHelper("List", "Tariffs"), { params: {
            _: new Date().getTime()
        }});
        commit(Mutations.SET_IS_LOADING, false);
        handleResult(result);
        commit(Mutations.SET_TARIFFS, result.data);
        return result.data.Items;
    },

    async [Actions.STORE_COMPANY_INFO]({ commit }: { commit: Commit }, companyInfo: ICompany): Promise<any> {
        commit(Mutations.SET_IS_LOADING, true);
        const result = await Axios.post(urlHelper("StoreCard", "Companies"), companyInfo);
        commit(Mutations.SET_IS_LOADING, false);
        handleResult(result);
        return result.data;
    },

    async [Actions.CHANGE_TARIFF]({ commit }: { commit: Commit }, { tariffId }: { tariffId: number }): Promise<any> {
        commit(Mutations.SET_IS_LOADING, true);
        const result = await Axios.post(urlHelper("ChangeTariff", "Companies"), { tariffId});
        commit(Mutations.SET_IS_LOADING, false);
        handleResult(result);
        return result.data;
    }
}

function handleResult(result: AxiosResponse): void {
    if (result.status === 200) {
        if (typeof result.data === "string") {
            throw new Error(result.data);
        }
    } else {
        logError(result.data);
        throw new Error(result.data);
    }
}
