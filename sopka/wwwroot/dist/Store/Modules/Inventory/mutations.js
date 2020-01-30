import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_LIST_IS_LOADING](state, isLoading) {
        state.IsListLoading = isLoading;
    },
    [Mutations.SET_OBJECT_LIST](state, objects) {
        state.Objects = objects;
    },
    [Mutations.SET_SELECTED_ID](state, id) {
        state.SelectedId = id;
        if (id == null) {
            state.Object = null;
        }
    },
    [Mutations.SET_IS_OBJECT_SAVING](state, value) {
        state.IsObjectSaving = value;
    },
    [Mutations.SET_IS_CONTENT_LOADING](state, value) {
        state.IsContentLoading = value;
    },
    [Mutations.SET_EQUIPMENT_LIST](state, equipment) {
        state.EquipmentList = equipment;
    },
    [Mutations.SET_EQUIPMENT_FILTER](state, filter) {
        state.EquipmentFilter = filter;
    },
    [Mutations.SET_EQUIPMENT_TOTAL_ITEMS](state, value) {
        state.EquipmentTotalItems = value;
    },
    [Mutations.SET_DEVICE_DICTIONARIES](state, dictionaries) {
        state.Devices.Dictionaries = dictionaries;
    },
    [Mutations.SET_OBJECT_DICTIONARIES](state, dictionaries) {
        state.Dictionaries = dictionaries;
    },
    [Mutations.SET_OBJECT](state, object) {
        state.Object = object;
    },
    [Mutations.SET_EQUIPMENT](state, object) {
        state.Equipment = object;
    }
};
//# sourceMappingURL=mutations.js.map