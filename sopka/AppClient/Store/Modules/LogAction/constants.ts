export const namespace: string = "logAction";

export class Actions {
    public static LOAD_DICTIONARIES = "LOAD_DICTIONARIES";
    public static LOAD_LOGS = "LOAD_LOGS";
}

export class Mutations {
    public static SET_DICTIONARIES = "SET_DICTIONARIES";
    public static SET_LOGS = "SET_LOGS";
    public static SET_LOGS_TOTAL_COUNT = "SET_LOGS_TOTAL_COUNT";
    public static SET_IS_LOADING = "SET_IS_LOADING";
    public static SET_FILTER = "SET_FILTER";
    public static SET_SELECTED_LOG = "SET_SELECTED_LOG";
}

export class Getters {
    public static DICTIONARIES = "DICTIONARIES";
    public static LOGS = "LOGS";
    public static LOGS_TOTAL_COUNT = "LOGS_TOTAL_COUNT";
    public static FILTER = "FILTER";
    public static GET_NEW_FILTER = "GET_NEW_FILTER";
    public static GET_SELECTED_LOG = "GET_SELECTED_LOG";
}