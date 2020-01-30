import { ActionTree, Commit } from "vuex";
import { IRootState } from "../../types";
import { IEquipmentJournalState, IEquipmentJournalFilter, IEquipmentJournalItem, IEquipmentJournalDictionaries } from "./types";
import { Actions, Mutations } from "./constants";
import { logError, urlHelper } from "../../../Shared/utils";
import Axios, { AxiosResponse } from "axios";

export const actions: ActionTree<IEquipmentJournalState, IRootState> = {
    async [Actions.FETCH_DICTIONARIES]({ commit }: { commit: Commit} ): Promise<IEquipmentJournalDictionaries> {
        const result = await Axios.get(urlHelper("Dictionaries", "EquipmentJournals"), { params: {
            _: new Date().getTime(),
        }});
        handleResult(result);
        commit(Mutations.SET_DICTIONARIES, result.data);
        return result.data;
    },

    async [Actions.FETCH_LIST]({ commit }: { commit: Commit}, filter: IEquipmentJournalFilter ): Promise<IEquipmentJournalDictionaries> {
        commit(Mutations.SET_IS_LOADING, true);
        const result = await Axios.get(urlHelper("List", "EquipmentJournals"), { params: {
            _: new Date().getTime(),
            ...filter
        }});
        commit(Mutations.SET_IS_LOADING, false);
        handleResult(result);
        commit(Mutations.SET_JOURNAL_LIST, result.data.Items);
        commit(Mutations.SET_JOURNAL_TOTAL_ITEMS, result.data.Total);
        return result.data;
    },
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

