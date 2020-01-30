import Vue from "vue";
import Vuex from "vuex";
import { inventory } from "./Modules/Inventory/index";
import { equipment } from "./Modules/Equipment/index";
import { incident } from "./Modules/Incident/index";
import { dictionaries } from "./Modules/Dictionaries/index";
import { common } from "./Modules/Common/index";
import { users } from "./Modules/Users/index";
import { knowledgeBase } from "./Modules/KnowledgeBase/index";
import { logAction } from "./Modules/LogAction/index";
import { equipmentLogs } from "./Modules/EquipmentLogs/index";
import { equipmentJournals } from "./Modules/EquipmentJournals/index";
Vue.use(Vuex);
const storeOpts = {
    modules: {
        inventory,
        equipment,
        incident,
        dictionaries,
        common,
        users,
        knowledgeBase,
        logAction,
        equipmentLogs,
        equipmentJournals
    }
};
export const store = new Vuex.Store(storeOpts);
//# sourceMappingURL=index.js.map