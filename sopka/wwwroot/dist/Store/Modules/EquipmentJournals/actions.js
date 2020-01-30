var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Actions, Mutations } from "./constants";
import { logError, urlHelper } from "../../../Shared/utils";
import Axios from "axios";
export const actions = {
    [Actions.FETCH_DICTIONARIES]({ commit }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Axios.get(urlHelper("Dictionaries", "EquipmentJournals"), { params: {
                    _: new Date().getTime(),
                } });
            handleResult(result);
            commit(Mutations.SET_DICTIONARIES, result.data);
            return result.data;
        });
    },
    [Actions.FETCH_LIST]({ commit }, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_LOADING, true);
            const result = yield Axios.get(urlHelper("List", "EquipmentJournals"), { params: Object.assign({ _: new Date().getTime() }, filter) });
            commit(Mutations.SET_IS_LOADING, false);
            handleResult(result);
            commit(Mutations.SET_JOURNAL_LIST, result.data.Items);
            commit(Mutations.SET_JOURNAL_TOTAL_ITEMS, result.data.Total);
            return result.data;
        });
    },
};
function handleResult(result) {
    if (result.status === 200) {
        if (typeof result.data === "string") {
            throw new Error(result.data);
        }
    }
    else {
        logError(result.data);
        throw new Error(result.data);
    }
}
//# sourceMappingURL=actions.js.map