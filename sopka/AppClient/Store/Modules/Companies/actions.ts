import { ActionTree, Commit } from "vuex";
import { Actions, Mutations } from "./constants";
import { ICompaniesState, ICompanyFilter, ICompanyListItem, ICompanyEditModel } from "./types";
import { IRootState } from "../../../Store/types";
import { logError, urlHelper } from "../../../Shared/utils";
import Axios, { AxiosResponse } from "axios";


export const actions: ActionTree<ICompaniesState, IRootState> = {
    async [Actions.FETCH_COMPANIES]({ commit }: { commit: Commit}, filter: ICompanyFilter): Promise<ICompanyListItem[]> {
        commit(Mutations.SET_IS_LIST_LOADING, true);
        const result = await Axios.get(urlHelper("List", "Companies"), { params: {
            _: new Date().getTime(),
            ... filter
        }});
        commit(Mutations.SET_IS_LIST_LOADING, false);
        handleResult(result);
        commit(Mutations.SET_COMPANIES_LIST, result.data.Items);
        commit(Mutations.SET_COMPANIES_TOTAL, result.data.Total);
        return result.data.Items;
    },

    async [Actions.CHANGE_BALANCE]({ commit }: { commit: Commit }, { companyId, amount }: { companyId: number, amount: number }): Promise<any> {
        commit(Mutations.SET_IS_LIST_LOADING, true);
        const result = await Axios.post(urlHelper("ChangeBalance", "Companies"), { companyId, amount });
        commit(Mutations.SET_IS_LIST_LOADING, false);
        handleResult(result);
        return result.data.Items;
    },

    async [Actions.STORE_COMPANY]({ commit }: { commit: Commit }, company: ICompanyEditModel): Promise<any> {
        commit(Mutations.SET_IS_LIST_LOADING, true);
        const result = await Axios.post(urlHelper("EditCompanyInfo", "Companies"), company);
        commit(Mutations.SET_IS_LIST_LOADING, false);
        handleResult(result);
        return result.data.Items;
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
