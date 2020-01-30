import { Getters } from "./constants";
export const getters = {
    [Getters.EQUIPMENT_LIST](state) {
        return state.Equipments;
    },
    [Getters.DICTIONARIES](state) {
        return state.Dictionaries;
    },
    [Getters.NEW_EQUIPMENT_FILTER](state) {
        return () => {
            return {
                Page: 1,
                ItemsPerPage: 10,
                ObjectId: "",
                CPUId: "",
                HDDId: "",
                MemoryId: "",
                NetworkAdapterId: "",
                OperationSystemId: "",
                SoftwareId: "",
                SortColumn: "",
                SortDirection: "",
                Query: ""
            };
        };
    },
    [Getters.SELECTED_ID](state) {
        return state.SelectedId;
    }
};
//# sourceMappingURL=getters.js.map