import { MutationTree } from "vuex";
import { IInventoryState, IObjectEntry, IEquipmentListFilter, IDictionaryItem, IEquipmentListItem, IEquipment } from "./types";
import { Mutations } from "./constants";

export const mutations: MutationTree<IInventoryState> = {

    [Mutations.SET_LIST_IS_LOADING](state: IInventoryState, isLoading: boolean): void {
        state.IsListLoading = isLoading;
    },

    [Mutations.SET_OBJECT_LIST](state: IInventoryState, objects: IObjectEntry[]): void {
        state.Objects = objects;
    },

    [Mutations.SET_SELECTED_ID](state: IInventoryState, id: number | null ): void {
        state.SelectedId = id;
        if (id == null) {
            state.Object = null;
        }
    },

    [Mutations.SET_IS_OBJECT_SAVING](state: IInventoryState, value: boolean): void {
        state.IsObjectSaving = value;
    },

    [Mutations.SET_IS_CONTENT_LOADING](state: IInventoryState, value: boolean): void {
        state.IsContentLoading = value;
    },

    [Mutations.SET_EQUIPMENT_LIST](state: IInventoryState, equipment: IEquipmentListItem[]): void {
        state.EquipmentList = equipment;
    },

    [Mutations.SET_EQUIPMENT_FILTER](state: IInventoryState, filter: IEquipmentListFilter): void {
        state.EquipmentFilter = filter;
    },

    [Mutations.SET_EQUIPMENT_TOTAL_ITEMS](state: IInventoryState, value: number): void {
        state.EquipmentTotalItems = value;
    },

    [Mutations.SET_DEVICE_DICTIONARIES](state: IInventoryState, dictionaries: {
        DeviceTypes: IDictionaryItem[],
        Platforms: IDictionaryItem[],
        Objects: IDictionaryItem[],
        RaidTypes: IDictionaryItem[],
        CPU: IDictionaryItem[],
        Memory: IDictionaryItem[],
        OS: IDictionaryItem[],
        Software: IDictionaryItem[],
        HDD: IDictionaryItem[],
        NetworkAdapters: IDictionaryItem[]
    }): void {
        state.Devices.Dictionaries = dictionaries;

    },

    [Mutations.SET_OBJECT_DICTIONARIES](state: IInventoryState, dictionaries: {
        Branches: IDictionaryItem[],
        Types: IDictionaryItem[]
    }): void {
        state.Dictionaries = dictionaries;

    },

    [Mutations.SET_OBJECT](state: IInventoryState, object: IObjectEntry): void {
        state.Object = object;
    },

    [Mutations.SET_EQUIPMENT](state: IInventoryState, object: IEquipment): void {
        state.Equipment = object;
    }

};
