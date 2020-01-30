import { IEquipmentState, IEquipmentFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
import { IDictionaryItem } from "../Inventory/types";

const namespaced: boolean = true;

export const state: IEquipmentState = {
    Equipments: [],
    Filter: <IEquipmentFilter> {
        Page: 1,
        ItemsPerPage: 10,
        ObjectId: "",
        CPUId: "",
        HDDId: "",
        MemoryId: "",
        NetworkAdapterId: "",
        OperationSystemId: "",
        SoftwareId: "",
        SortColumn: "Id",
        SortDirection: "ASC",

    },
    SelectedId: null,
    IsContentLoading: false,
    EquipmentTotalItems: 0,
    Dictionaries: {
        Objects: [],
        CPU: [],
        Memory: [],
        HDD: [],
        NetworkAdapters: [],
        OS: [],
        Software: [],
        Platforms: [],
        DeviceTypes: [],
        RaidTypes: []
    }
};

export const equipment: Module<IEquipmentState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
