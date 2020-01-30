export const namespace: string = "equipmentJournals";

export class Actions {
    public static FETCH_LIST = "FETCH_LIST";
    public static FETCH_DICTIONARIES = "FETCH_DICTIONARIES";
}

export class Mutations {
    public static SET_IS_LOADING = "SET_IS_LOADING";
    public static SET_JOURNAL_LIST = "SET_JOURNAL_LIST";
    public static SET_JOURNAL_TOTAL_ITEMS = "SET_JOURNAL_TOTAL_ITEMS";
    public static SET_FILTER = "SET_FILTER";
    public static SET_DICTIONARIES = "SET_DICTIONARIES";
}

export class Getters {
    public static CURRENT_FILTER = "CURRENT_FILTER";
    public static NEW_FILTER = "NEW_FILTER";
    public static IS_LOADING = "IS_LOADING";
    public static JOURNAL_LIST = "JOURNAL_LIST";
    public static JOURNAL_LIST_TOTAL = "JOURNAL_LIST_TOTAL";
    public static DICTIONARIES = "DICTIONARIES";
}