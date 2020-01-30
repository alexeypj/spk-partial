import { GetterTree } from "vuex";
import { IEquipmentState, IEquipmentFilter, IEquipmentDictionaries } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";
import { IEquipment } from "../Inventory/types";

export const getters: GetterTree<IEquipmentState, IRootState> = {

    [Getters.EQUIPMENT_LIST](state: IEquipmentState): Array<IEquipment> {
        return state.Equipments;
    },

    [Getters.DICTIONARIES](state: IEquipmentState): IEquipmentDictionaries {
        return state.Dictionaries;
    },

    [Getters.NEW_EQUIPMENT_FILTER](state: IEquipmentState): () => IEquipmentFilter {
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

    [Getters.SELECTED_ID](state: IEquipmentState): number|null {
      return state.SelectedId;
    }
};