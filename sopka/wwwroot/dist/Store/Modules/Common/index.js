import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
const namespaced = true;
export const state = {
    CurrentUser: window.currentUser,
    Settings: {
        PortalLogo: "",
        PortalTitle: "",
        PortalType: "",
        LoginLogo: ""
    },
    IsFileListLoading: false
};
export const common = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
//# sourceMappingURL=index.js.map