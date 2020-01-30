import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_IS_CONTENT_LOADING](state, value) {
        state.IsContentLoading = value;
    },
    [Mutations.SET_EQUIPMENT_LIST](state, equipment) {
        state.Equipments = equipment;
    },
    [Mutations.SET_EQUIPMENT_FILTER](state, filter) {
        state.Filter = filter;
    },
    [Mutations.SET_EQUIPMENT_TOTAL_ITEMS](state, value) {
        state.EquipmentTotalItems = value;
    },
    [Mutations.SET_EQUIPMENT_DICTIONARIES](state, dictionaries) {
        state.Dictionaries = dictionaries;
    },
    [Mutations.SET_SELECTED_ID](state, id) {
        state.SelectedId = id;
    }
};
//# sourceMappingURL=mutations.js.map