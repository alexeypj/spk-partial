import { ActionTree, Commit } from "vuex";
import { IRootState } from "../../types";
import { IEquipmentLogsState, IEquipmentLogsFilter, IRule } from "./types";
import { Actions, Mutations } from "./constants";
import { logError, urlHelper } from "../../../Shared/utils";
import Axios, { AxiosResponse } from "axios";

export const actions: ActionTree<IEquipmentLogsState, IRootState> = {

    async [Actions.FETCH_RULES_LIST]({ commit }: { commit: Commit}, filter: IEquipmentLogsFilter ): Promise<IRule[]> {
        commit(Mutations.SET_IS_LIST_LOADING, true);
        const result = await Axios.get(urlHelper("List", "EquipmentLogs"), { params: {
            _: new Date().getTime(),
            ... filter
        }});
        commit(Mutations.SET_IS_LIST_LOADING, false);
        handleResult(result);
        commit(Mutations.SET_LIST, result.data);
        return result.data.Items;
    },

    async [Actions.STORE_RULE]({ commit }: { commit: Commit}, model: IRule): Promise<IRule> {
        if (!model) {
            throw new Error("Model is empty");
        }
        commit(Mutations.SET_IS_RULE_SAVING, true);
        const result = await Axios.post(urlHelper("Store", "EquipmentLogs"), model);
        commit(Mutations.SET_IS_RULE_SAVING, false);
        handleResult(result);
        return result.data;
    },

    async [Actions.CHANGE_ACTIVITY]({ commit }: { commit: Commit}, { id, value }: { id: number, value: boolean}): Promise<boolean> {
        commit(Mutations.SET_IS_RULE_SAVING, true);
        const result = await Axios.post(urlHelper("ChangeActivity", "EquipmentLogs"), {
            Id: id,
            Active: value
        });
        commit(Mutations.SET_IS_RULE_SAVING, false);
        handleResult(result);
        return result.data;
    },

    async [Actions.FETCH_RULE]({ commit }: { commit: Commit}, id: number): Promise<IRule> {
        commit(Mutations.SET_IS_LOADING, true);
        const result = await Axios.get(urlHelper("Get", "EquipmentLogs"), { params: {
            _: new Date().getTime(),
            id
        }});
        commit(Mutations.SET_IS_LOADING, false);
        handleResult(result);
        return result.data;
    },

    async [Actions.REMOVE_RULE]({ commit }: { commit: Commit}, id: number): Promise<boolean> {
        commit(Mutations.SET_IS_RULE_SAVING, true);
        const result = await Axios.post(urlHelper("Remove/?id=" + id, "EquipmentLogs"));
        commit(Mutations.SET_IS_RULE_SAVING, false);
        handleResult(result);
        return result.data;
    },
};

/** Первоначальная обработка ошибок запроса */
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
