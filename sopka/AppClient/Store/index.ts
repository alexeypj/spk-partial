import Vue from "vue";
import Vuex, { StoreOptions, Store } from "vuex";
import { IRootState } from "./types";
import { inventory } from "./Modules/Inventory/index";
import { equipment  } from "./Modules/Equipment/index";
import { incident  } from "./Modules/Incident/index";
import { dictionaries } from "./Modules/Dictionaries/index";
import { common } from "./Modules/Common/index";
import { users } from "./Modules/Users/index";
import { knowledgeBase } from "./Modules/KnowledgeBase/index";
import { logAction } from "./Modules/LogAction/index";
import { equipmentLogs } from "./Modules/EquipmentLogs/index";
import { equipmentJournals } from "./Modules/EquipmentJournals/index";
import { vulnerabilities } from "./Modules/Vulnerabilities/index";
import { companies } from "./Modules/Companies/index";
import { companyCard } from "./Modules/CompanyCard/index";
import { tariffs } from "./Modules/Tariffs/index";

Vue.use(Vuex);

const storeOpts: StoreOptions<IRootState> = {
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
        equipmentJournals,
        vulnerabilities,
        companies,
        companyCard,
        tariffs
    }
};

export const store: Store<IRootState> = new Vuex.Store<IRootState>(storeOpts);
