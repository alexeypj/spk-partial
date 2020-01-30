import { ICommon, User } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: ICommon = {
    CurrentUser: window.currentUser as User,
    Settings: {
        Logo: {
            PortalLogo: "",
            PortalTitle: "",
            PortalType: "",
            LoginLogo: "",
        },
        MaxFileSize: 2,
        IsLimited: true,
        IsDebug: false
    },
    IsFileListLoading: false
};

export const common: Module<ICommon, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
