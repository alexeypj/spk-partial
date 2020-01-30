// tslint:disable max-classes-per-file
export const namespace: string = "inventory";

export class Actions {
    public static FETCH_OBJECT_LIST = "FETCH_OBJECT_LIST";
    public static STORE_OBJECT = "STORE_OBJECT";
    public static FETCH_EQUIPMENT_LIST = "FETCH_EQUIPMENT_LIST";
    public static FETCH_EQUIPMENT = "FETCH_EQUIPMENT";
    public static FETCH_DEVICE_DICTIONARIES = "FETCH_EQUIPMENT_DICTIONARIES";
    public static FETCH_OBJECT_DICTIONARIES = "FETCH_OBJECT_DICTIONARIES";
    public static FETCH_DEVICE = "FETCH_DEVICE";
    public static STORE_EQUIPMENT = "STORE_EQUIPMENT";
    public static REMOVE_EQUIPMENT = "REMOVE_EQUIPMENT";
    public static STORE_DEVICE = "STORE_DEVICE";
    public static FETCH_OBJECT = "FETCH_OBJECT";
    public static REMOVE_OBJECT = "REMOVE_OBJECT";
    public static FETCH_SUMMARY = "FETCH_SUMMARY";
}

export class Mutations {
    public static SET_LIST_IS_LOADING = "SET_LIST_IS_LOADING";
    public static SET_OBJECT_LIST = "SET_OBJECT_LIST";
    public static SET_IS_OBJECT_SAVING = "SET_IS_OBJECT_SAVING";
    public static SET_EQUIPMENT_LIST = "SET_EQUIPMENT_LIST";
    public static SET_EQUIPMENT_FILTER = "SET_EQUIPMENT_FILTER";
    public static SET_EQUIPMENT_TOTAL_ITEMS = "SET_EQUIPMENT_TOTAL_ITEMS";
    public static SET_EQUIPMENT = "SET_EQUIPMENT";
    public static SET_DEVICE = "SET_DEVICE";
    public static SET_SELECTED_ID = "SET_SELECTED_ID";
    public static SET_DEVICE_DICTIONARIES = "SET_DEVICE_DICTIONARIES";
    public static SET_IS_CONTENT_LOADING = "SET_IS_CONTENT_LOADING";
    public static SET_CONTENT_TYPE = "SET_CONTENT_TYPE";
    public static SET_OBJECT_DICTIONARIES = "SET_OBJECT_DICTIONARIES";
    public static SET_OBJECT = "SET_OBJECT";
}

export class Getters {
    public static SELECTED_OBJECT = "SELECTED_OBJECT";
    public static SELECTED_ID = "SELECTED_ID";
    public static EQUIPMENT_LIST = "EQUIPMENT_LIST";
    public static EQUIPMENT = "EQUIPMENT";
    public static NEW_EQUIPMENT_FILTER = "NEW_EQUIPMENT_FILTER";
    public static SELECTED_EQUIPMENT_ID = "SELECTED_EQUIPMENT_ID";
    public static OBJECTS = "OBJECTS";
    public static DICTIONARY_PLATFORMS = "DICTIONARY_PLATFORMS";
    public static DICTIONARY_DEVICE_TYPES = "DICTIONARY_DEVICE_TYPES";
    public static DICTIONARY_OBJECTS = "DICTIONARY_OBJECTS";
    public static DICTIONARY_RAID_TYPES = "DICTIONARY_RAID_TYPES";
    public static DICTIONARY_CPU = "DICTIONARY_CPU";
    public static DICTIONARY_MEMORY = "DICTIONARY_MEMORY";
    public static DICTIONARY_OS = "DICTIONARY_OS";
    public static DICTIONARY_SOFTWARE = "DICTIONARY_SOFTWARE";
    public static DICTIONARY_HDD = "DICTIONARY_HDD";
    public static DICTIONARY_BRANCH = "DICTIONARY_BRANCH";
    public static DICTIONARY_OBJECT_TYPES = "DICTIONARY_OBJECT_TYPES";
    public static DICTIONARY_NETWORK_ADAPTERS = "DICTIONARY_NETWORK_ADAPTERS";
    public static CHECK_PERIOD_DICTIONARY = "CHECK_PERIOD_DICTIONARY";
}
