// tslint:disable max-classes-per-file
export const namespace: string = "equipmentLogs";

export class Actions {
    public static FETCH_RULES_LIST = "FETCH_RULES_LIST";
    public static STORE_RULE = "STORE_RULE";
    public static CHANGE_ACTIVITY = "CHANGE_ACTIVITY";
    public static FETCH_RULE = "FETCH_RULE";
    public static REMOVE_RULE = "REMOVE_RULE";
}

export class Mutations {
    public static SET_IS_LIST_LOADING = "SET_IS_LIST_LOADING";
    public static SET_IS_LOADING = "SET_IS_LOADING";
    public static SET_LIST = "SET_LIST";
    public static SET_IS_RULE_SAVING = "SET_IS_RULE_SAVING";
    public static SET_FILTER = "SET_FILTER";
}

export class Getters {
    public static CURRENT_FILTER = "CURRENT_FILTER";
    public static IS_LIST_LOADING = "IS_LIST_LOADING";
    public static RULES_LIST = "RULES_LIST";
    public static ON_CONDITION_DICTIONARY = "ON_CONDITION_DICTIONARY";
    public static ACTION_DICTIONARY = "ACTION_DICTIONARY";
    public static TIME_PERIOD_DICTIONARY = "TIME_PERIOD_DICTIONARY";
    public static IS_RULE_SAVING = "IS_RULE_SAVING";
    public static RULES_LIST_TOTAL = "RULES_LIST_TOTAL";
    public static FORMAT_RULE = "FORMAT_RULE";
    public static IS_RULE_LOADING = "IS_RULE_LOADING";
}
