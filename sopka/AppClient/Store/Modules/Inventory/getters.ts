import { GetterTree } from "vuex";
import { IInventoryState, IObjectEntry, IEquipmentListFilter, IDictionaryItem,	IEquipmentListItem, IEquipment,
    RecordsCheckPeriods
} from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";

export const getters: GetterTree<IInventoryState, IRootState> = {

    [Getters.SELECTED_OBJECT](state: IInventoryState): IObjectEntry | null {
        if (state.SelectedId == null) {
            return null;
        }

        if (state.SelectedId === 0) {
            return <IObjectEntry> {
                Id: 0,
                ObjectName: "",
                ContactPerson: "",
                ContactPosition: "",
                ContactPhone: "",
                ContactMail: "",
                Latitude: null,
                Longitude: null,
                ObjectAddress: ""
            };
        }
        return state.Object;
    },

    [Getters.SELECTED_ID](state: IInventoryState): number|null {
            return state.SelectedId;
    },

    [Getters.EQUIPMENT_LIST](state: IInventoryState): IEquipmentListItem[] {
        return state.EquipmentList;
    },

    [Getters.NEW_EQUIPMENT_FILTER](state: IInventoryState): (objectId: number) => IEquipmentListFilter {
        return (objectId: number) => {
            return { ...state.EquipmentFilter, ObjectId: objectId, Page: 1 };
        };
    },

    [Getters.DICTIONARY_PLATFORMS](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.Platforms;
    },

    [Getters.DICTIONARY_DEVICE_TYPES](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.DeviceTypes;
    },

    [Getters.DICTIONARY_OBJECTS](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.Objects;
    },

    [Getters.DICTIONARY_RAID_TYPES](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.RaidTypes;
    },

    [Getters.DICTIONARY_CPU](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.CPU;
    },

    [Getters.DICTIONARY_MEMORY](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.Memory;
    },

    [Getters.DICTIONARY_OS](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.OS;
    },

    [Getters.DICTIONARY_SOFTWARE](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.Software;
    },

    [Getters.DICTIONARY_HDD](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.HDD;
    },

    [Getters.DICTIONARY_BRANCH](state: IInventoryState): IDictionaryItem[] {
        return state.Dictionaries.Branches;
    },

    [Getters.DICTIONARY_OBJECT_TYPES](state: IInventoryState): IDictionaryItem[] {
        return state.Dictionaries.Types;
    },

    [Getters.DICTIONARY_NETWORK_ADAPTERS](state: IInventoryState): IDictionaryItem[] {
        return state.Devices.Dictionaries.NetworkAdapters;
    },

    [Getters.OBJECTS](state: IInventoryState): IObjectEntry[] {
        return state.Objects;
    },

    [Getters.EQUIPMENT](state: IInventoryState): IEquipment | null {
        return state.Equipment;
    },

    [Getters.CHECK_PERIOD_DICTIONARY](state: IInventoryState): IDictionaryItem[] {
        const result: IDictionaryItem[] = [];
        const keys = Object.keys(RecordsCheckPeriods).filter(x => !isNaN(Number(x)));
        for (const key of keys) {
            result.push(<IDictionaryItem>{ Key: key, Value: RecordsCheckPeriods[key] });
        }
        return result;
    },

};
