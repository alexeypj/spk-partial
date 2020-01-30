import { MutationTree } from "vuex";
import { ICommon, ISopkaSettings } from "./types";
import { Mutations } from "./constants";

export const mutations: MutationTree<ICommon> = {

    [Mutations.SET_SETTINGS](state: ICommon, settings: ISopkaSettings): void {
        state.Settings = settings;
    },

    [Mutations.SET_FILE_LIST_LOADING](state: ICommon, value: boolean): void {
        state.IsFileListLoading = value;
    }
};
