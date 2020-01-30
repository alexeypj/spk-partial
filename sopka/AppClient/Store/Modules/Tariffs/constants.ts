// tslint:disable max-classes-per-file
export const namespace: string = "tariffs";

export class Actions {
    public static FETCH_TARIFFS_LIST = "FETCH_TARIFFS_LIST";
    public static STORE_TARIFF = "STORE_TARIFF";
    public static REMOVE_TARIFF = "REMOVE_TARIFF";
}

export class Mutations {
    public static SET_IS_LOADING = "SET_IS_LOADING";
    public static SET_TARIFFS = "SET_TARIFFS";
    public static SET_TARIFFS_TOTAL = "SET_TARIFFS_TOTAL";
    public static SET_FILTER = "SET_FILTER";
    public static SET_SELECTED_TARIFF_ID = "SET_SELECTED_TARIFF_ID";
}

export class Getters {
    public static FILTER = "FILTER";
    public static IS_LOADING = "IS_LOADING";
    public static TARIFFS_LIST = "TARIFFS_LIST";
    public static SELECTED_TARIFF_ID = "SELECTED_TARIFF_ID";
    public static TARIFFS_TOTAL = "TARIFFS_TOTAL";
    public static TARIFF_BY_ID = "TARIFF_BY_ID";
}
