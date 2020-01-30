import { MutationTree } from "vuex";
import { IEquipmentState, IEquipmentFilter, IEquipmentDictionaries } from "./types";
import { Mutations } from "./constants";
import { IEquipment } from "../Inventory/types";

export const mutations: MutationTree<IEquipmentState> = {

    [Mutations.SET_IS_CONTENT_LOADING](state: IEquipmentState, value: boolean): void {
        state.IsContentLoading = value;
    },

    [Mutations.SET_EQUIPMENT_LIST](state: IEquipmentState, equipment: IEquipment[]): void {
        state.Equipments = equipment;
    },

    [Mutations.SET_EQUIPMENT_FILTER](state: IEquipmentState, filter: IEquipmentFilter): void {
        state.Filter = filter;
    },

    [Mutations.SET_EQUIPMENT_TOTAL_ITEMS](state: IEquipmentState, value: number): void {
        state.EquipmentTotalItems = value;
    },

    [Mutations.SET_EQUIPMENT_DICTIONARIES](state: IEquipmentState, dictionaries: IEquipmentDictionaries): void {
        state.Dictionaries = dictionaries;
    },

    [Mutations.SET_SELECTED_ID](state: IEquipmentState, id: number|null): void {
        state.SelectedId = id;
    }

};
