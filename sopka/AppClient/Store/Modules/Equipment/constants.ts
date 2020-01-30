// tslint:disable max-classes-per-file
export const namespace: string = "equipment";

export class Actions {
    public static FETCH_EQUIPMENT_LIST = "FETCH_EQUIPMENT_LIST";
    public static FETCH_DICTIONARIES = "FETCH_DICTIONARY";
    public static APPLY_COLUMN_FILTER = "APPLY_COLUMN_FILTER";
}

export class Mutations {
    public static SET_EQUIPMENT_LIST = "SET_EQUIPMENT_LIST";
    public static SET_EQUIPMENT_FILTER = "SET_EQUIPMENT_FILTER";
    public static SET_EQUIPMENT_TOTAL_ITEMS = "SET_EQUIPMENT_TOTAL_ITEMS";
    public static SET_EQUIPMENT_DICTIONARIES = "SET_EQUIPMENT_DICTIONARIES";
    public static SET_IS_CONTENT_LOADING = "SET_IS_CONTENT_LOADING";
    public static SET_SELECTED_ID = "SET_SELECTED_ID";
}

export class Getters {
    public static EQUIPMENT_LIST = "EQUIPMENT_LIST";
    public static DICTIONARIES = "DICTIONARIES";
    public static NEW_EQUIPMENT_FILTER = "NEW_EQUIPMENT_FILTER";
    public static SELECTED_ID = "SELECTED_ID";
}
