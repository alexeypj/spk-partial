import { ActionTree, Commit } from "vuex";
import { IRootState } from "../../types";
import { ICommon, IFile, ISopkaSettings } from "./types";
import { Actions, Mutations } from "./constants";
import Axios from "axios";
import { urlHelper } from "../../../Shared/utils";

export const actions: ActionTree<ICommon, IRootState> = {

    async [Actions.FETCH_FILE_INFO]({commit}: {commit: Commit}, id: number): Promise<IFile> {
        const response = await Axios.get(urlHelper("Info" , "Files"), { params: {
            _: new Date().getTime(),
            id
        }});

        if (response.status === 200) {
                return response.data;
        } else {
            throw response.data;
        }
    },

    async [Actions.FETCH_SETTINGS]({ commit }: {commit: Commit}): Promise<ISopkaSettings> {
        // commit(Mutations.SET_IS_CONTENT_LOADING, true);
        try {
            const result = await Axios.get(urlHelper("GetSettings", "Settings"), {
                params: {
                    _: new Date().getTime()
                }
            });
            commit(Mutations.SET_SETTINGS, result.data);
            return result.data;
        } finally {
            //  commit(Mutations.SET_IS_CONTENT_LOADING, false);
        }
    },

    async [Actions.FETCH_FILE_LIST]({ commit }: { commit: Commit}, {id, type}: {id: number, type: string}): Promise<IFile[]> {
        commit(Mutations.SET_FILE_LIST_LOADING, true);

        const response = await Axios.get(urlHelper("List" , "Files"), { params: {
            _: new Date().getTime(),
            id,
            type
        }});

        commit(Mutations.SET_FILE_LIST_LOADING, false);
        if (response.status === 200) {
            if (typeof response.data === "string") {
                throw response.data;
            } else {
                return response.data;
            }
        } else {
            throw response.data;
        }
    }
};
