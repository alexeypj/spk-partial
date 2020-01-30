import { ActionTree, Commit } from "vuex";
import { IRootState } from "../../types";
import { ILogActionState, ILogActionDictionaries, ILogAction, ILogActionFilter } from "./types";
import { Actions, Mutations } from "./constants";
import { urlHelper, logError } from "../../../Shared/utils";
import Axios from "axios";

export const actions: ActionTree<ILogActionState, IRootState> = {

    async [Actions.LOAD_DICTIONARIES]({ commit }: { commit: Commit}): Promise<ILogActionDictionaries> {
        commit(Mutations.SET_IS_LOADING, true);
        const response = await Axios.get(urlHelper("Dictionaries" , "LogAction"), { params: {
            _: new Date().getTime()
        }});

        commit(Mutations.SET_IS_LOADING, false);
        if (response.status === 200) {
            commit(Mutations.SET_DICTIONARIES, response.data);
            return response.data;
        } else {
            throw response.data;
        }
    },

    async [Actions.LOAD_LOGS]({ commit }: { commit: Commit}, filter: ILogActionFilter): Promise<ILogAction[]> {
        commit(Mutations.SET_IS_LOADING, true);
        const response = await Axios.get(urlHelper("GetLogs" , "LogAction"), { params: {
            _: new Date().getTime(),
            ...filter
        }});

        commit(Mutations.SET_IS_LOADING, false);
        if (response.status === 200) {
            commit(Mutations.SET_LOGS_TOTAL_COUNT, response.data.Total);
            commit(Mutations.SET_LOGS, response.data.Items);
            return response.data.Items;
        } else {
            throw response.data;
        }
    },

}
