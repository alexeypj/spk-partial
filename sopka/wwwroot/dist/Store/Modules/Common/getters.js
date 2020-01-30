import { Roles } from "./types";
import { Getters } from "./constants";
import { isUserInRole } from "../../../Shared/utils";
export const getters = {
    [Getters.IS_ADMIN](state) {
        return isUserInRole(state.CurrentUser, Roles.Admin);
    },
    [Getters.IS_AUTHENTICATED](state) {
        return state.CurrentUser.IsAuthenticated;
    },
    [Getters.ASSEMBLY](state) {
        return window.assembly;
    },
    [Getters.CURRENT_USER](state) {
        return state.CurrentUser;
    },
    [Getters.SETTINGS](state) {
        return state.Settings;
    },
    [Getters.HAS_ROLE](state) {
        return (roleId) => {
            if (state.CurrentUser && state.CurrentUser.UserRoles) {
                const role = state.CurrentUser.UserRoles.find(x => x.RoleId === roleId);
                if (role) {
                    return true;
                }
            }
            return false;
        };
    },
    [Getters.IS_FILE_LIST_LOADING](state) {
        return state.IsFileListLoading;
    }
};
//# sourceMappingURL=getters.js.map