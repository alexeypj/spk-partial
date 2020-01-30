import { Getters } from "./constants";
export const getters = {
    [Getters.SELECTED_OBJECT](state) {
        if (state.SelectedId == null) {
            return null;
        }
        if (state.SelectedId === 0) {
            return {
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
    [Getters.SELECTED_ID](state) {
        return state.SelectedId;
    },
    [Getters.EQUIPMENT_LIST](state) {
        return state.EquipmentList;
    },
    [Getters.NEW_EQUIPMENT_FILTER](state) {
        return (objectId) => {
            return Object.assign({}, state.EquipmentFilter, { ObjectId: objectId, Page: 1 });
        };
    },
    [Getters.DICTIONARY_PLATFORMS](state) {
        return state.Devices.Dictionaries.Platforms;
    },
    [Getters.DICTIONARY_DEVICE_TYPES](state) {
        return state.Devices.Dictionaries.DeviceTypes;
    },
    [Getters.DICTIONARY_OBJECTS](state) {
        return state.Devices.Dictionaries.Objects;
    },
    [Getters.DICTIONARY_RAID_TYPES](state) {
        return state.Devices.Dictionaries.RaidTypes;
    },
    [Getters.DICTIONARY_CPU](state) {
        return state.Devices.Dictionaries.CPU;
    },
    [Getters.DICTIONARY_MEMORY](state) {
        return state.Devices.Dictionaries.Memory;
    },
    [Getters.DICTIONARY_OS](state) {
        return state.Devices.Dictionaries.OS;
    },
    [Getters.DICTIONARY_SOFTWARE](state) {
        return state.Devices.Dictionaries.Software;
    },
    [Getters.DICTIONARY_HDD](state) {
        return state.Devices.Dictionaries.HDD;
    },
    [Getters.DICTIONARY_BRANCH](state) {
        return state.Dictionaries.Branches;
    },
    [Getters.DICTIONARY_OBJECT_TYPES](state) {
        return state.Dictionaries.Types;
    },
    [Getters.DICTIONARY_NETWORK_ADAPTERS](state) {
        return state.Devices.Dictionaries.NetworkAdapters;
    },
    [Getters.OBJECTS](state) {
        return state.Objects;
    },
    [Getters.EQUIPMENT](state) {
        return state.Equipment;
    }
};
//# sourceMappingURL=getters.js.map