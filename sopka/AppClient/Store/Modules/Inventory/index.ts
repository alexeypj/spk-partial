import { IInventoryState, IEquipmentListFilter } from "./types";
import { Module } from "vuex";
import { IRootState } from "../../types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const namespaced: boolean = true;

export const state: IInventoryState = {
    Object: null,
    Objects: [],
    IsListLoading: false,
    IsContentLoading: false,
    SelectedId: null,
    Dictionaries: {
        Branches: [],
        Types: []
    },
    IsObjectSaving: false,
    EquipmentList: [],
    EquipmentFilter: <IEquipmentListFilter> {
        Page: 1,
        ItemsPerPage: 10
    },
    Equipment: null,
    EquipmentTotalItems: 0,
    Devices: {
        Dictionaries: {
            DeviceTypes: [],
            Platforms: [],
            Objects: [],
            RaidTypes: [],
            CPU: [],
            Memory: [],
            OS: [],
            Software: [],
            HDD: [],
            NetworkAdapters: []
        }
    }
};

export const inventory: Module<IInventoryState, IRootState> = {
    namespaced,
    state,
    actions,
    mutations,
    getters
};
