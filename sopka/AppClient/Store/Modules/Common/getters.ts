import { GetterTree } from "vuex";
import { ICommon, IUser, Roles, ISopkaSettings } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";
import { isUserInRole } from "../../../Shared/utils"

export const getters: GetterTree<ICommon, IRootState> = {

  [Getters.IS_ADMIN](state: ICommon): boolean {
    return isUserInRole(state.CurrentUser, Roles.Admin);
  },

  [Getters.IS_COMPANY_ADMIN](state: ICommon): boolean {
    return isUserInRole(state.CurrentUser, Roles.CompanyAdmin);
  },

  [Getters.IS_AUTHENTICATED](state: ICommon): boolean {
    return state.CurrentUser.IsAuthenticated;
  },

  [Getters.ASSEMBLY](state: ICommon): string {
    return window.assembly;
  },

  [Getters.CURRENT_USER](state: ICommon): IUser {
    return state.CurrentUser;
  },

  [Getters.SETTINGS](state: ICommon): ISopkaSettings {
    return state.Settings;
  },

  [Getters.HAS_ROLE](state: ICommon): (roleId: string) => boolean {
    return (roleId: string) => {
      if (state.CurrentUser && state.CurrentUser.UserRoles) {
        const role = state.CurrentUser.UserRoles.find(x => x.RoleId === roleId);
        if (role) {
          return true;
        }
      }
      return false;
    };
  },

  [Getters.IS_FILE_LIST_LOADING](state: ICommon): boolean {
    return state.IsFileListLoading;
  },

  [Getters.IS_SUPER_ADMIN_OR_PAID](state: ICommon): boolean {
    //return false;
    if (!state.CurrentUser.CompanyId) {
      return true;
    }
    return state.CurrentUser.IsAccessPaid || false;
    //if (state.CurrentUser.IsAccessPaid) {
    //  return true;
    //}
    //return false;
  },
};
