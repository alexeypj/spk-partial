var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Actions, Mutations } from "./constants";
import Axios from "axios";
import { urlHelper } from "../../../Shared/utils";
export const actions = {
    [Actions.FETCH_FILE_INFO]({ commit }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield Axios.get(urlHelper("Info", "Files"), { params: {
                    _: new Date().getTime(),
                    id
                } });
            if (response.status === 200) {
                return response.data;
            }
            else {
                throw response.data;
            }
        });
    },
    [Actions.FETCH_SETTINGS]({ commit }) {
        return __awaiter(this, void 0, void 0, function* () {
            // commit(Mutations.SET_IS_CONTENT_LOADING, true);
            try {
                const result = yield Axios.get(urlHelper("GetSettings", "Settings"), {
                    params: {
                        _: new Date().getTime()
                    }
                });
                commit(Mutations.SET_SETTINGS, result.data);
                return result.data;
            }
            finally {
                //  commit(Mutations.SET_IS_CONTENT_LOADING, false);
            }
        });
    },
    [Actions.FETCH_FILE_LIST]({ commit }, { id, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_FILE_LIST_LOADING, true);
            const response = yield Axios.get(urlHelper("List", "Files"), { params: {
                    _: new Date().getTime(),
                    id,
                    type
                } });
            commit(Mutations.SET_FILE_LIST_LOADING, false);
            if (response.status === 200) {
                if (typeof response.data === "string") {
                    throw response.data;
                }
                else {
                    return response.data;
                }
            }
            else {
                throw response.data;
            }
        });
    }
};
//# sourceMappingURL=actions.js.map