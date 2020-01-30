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
    [Actions.FETCH_RULES_LIST]({ commit }, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_LIST_LOADING, true);
            const result = yield Axios.get(urlHelper("List", "EquipmentLogs"), { params: Object.assign({ _: new Date().getTime() }, filter) });
            commit(Mutations.SET_IS_LIST_LOADING, false);
            handleResult(result);
            commit(Mutations.SET_LIST, result.data);
            return result.data.Items;
        });
    },
    [Actions.STORE_RULE]({ commit }, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!model) {
                throw new Error("Model is empty");
            }
            commit(Mutations.SET_IS_RULE_SAVING, true);
            const result = yield Axios.post(urlHelper("Store", "EquipmentLogs"), model);
            commit(Mutations.SET_IS_RULE_SAVING, false);
            handleResult(result);
            return result.data;
        });
    },
    [Actions.CHANGE_ACTIVITY]({ commit }, { id, value }) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_RULE_SAVING, true);
            const result = yield Axios.post(urlHelper("ChangeActivity", "EquipmentLogs"), {
                Id: id,
                Active: value
            });
            commit(Mutations.SET_IS_RULE_SAVING, false);
            handleResult(result);
            return result.data;
        });
    },
    [Actions.FETCH_RULE]({ commit }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_LOADING, true);
            const result = yield Axios.get(urlHelper("Get", "EquipmentLogs"), { params: {
                    _: new Date().getTime(),
                    id
                } });
            commit(Mutations.SET_IS_LOADING, false);
            handleResult(result);
            return result.data;
        });
    },
    [Actions.REMOVE_RULE]({ commit }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            commit(Mutations.SET_IS_RULE_SAVING, true);
            const result = yield Axios.post(urlHelper("Remove/?id=" + id, "EquipmentLogs"));
            commit(Mutations.SET_IS_RULE_SAVING, false);
            handleResult(result);
            return result.data;
        });
    },
};
/** Первоначальная обработка ошибок запроса */
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