var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Actions, Mutations } from "./constants";
import { urlHelper } from "../../../Shared/utils";
import Axios from "axios";
export const actions = {
    [Actions.LOAD_DICTIONARIES]({ commit }) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_LOADING, true);
            const response = yield Axios.get(urlHelper("Dictionaries", "LogAction"), { params: {
                    _: new Date().getTime()
                } });
            commit(Mutations.SET_IS_LOADING, false);
            if (response.status === 200) {
                commit(Mutations.SET_DICTIONARIES, response.data);
                return response.data;
            }
            else {
                throw response.data;
            }
        });
    },
    [Actions.LOAD_LOGS]({ commit }, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_LOADING, true);
            const response = yield Axios.get(urlHelper("GetLogs", "LogAction"), { params: Object.assign({ _: new Date().getTime() }, filter) });
            commit(Mutations.SET_IS_LOADING, false);
            if (response.status === 200) {
                commit(Mutations.SET_LOGS_TOTAL_COUNT, response.data.Total);
                commit(Mutations.SET_LOGS, response.data.Items);
                return response.data.Items;
            }
            else {
                throw response.data;
            }
        });
    },
};
//# sourceMappingURL=actions.js.map