export const namespace: string = "companies";

export class Actions {
    public static FETCH_COMPANIES = "FETCH_COMPANIES";
    public static CHANGE_BALANCE = "CHANGE_BALANCE";
    public static STORE_COMPANY = "STORE_COMPANY";
}

export class Mutations {
    public static SET_IS_LIST_LOADING = "SET_IS_LIST_LOADING";
    public static SET_COMPANIES_LIST = "SET_COMPANIES_LIST";
    public static SET_COMPANIES_TOTAL = "SET_COMPANIES_TOTAL";
    public static SET_FILTER = "SET_FILTER";
}

export class Getters {
    public static COMPANIES_LIST = "COMPANIES_LIST";
    public static TOTAL = "TOTAL";
    public static IS_LOADING = "IS_LOADING";
    public static FILTER = "FILTER";
}
