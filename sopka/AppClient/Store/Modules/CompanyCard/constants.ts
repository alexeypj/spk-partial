export const namespace: string = "companyCard";

export class Actions {
    public static FETCH_COMPANY_INFO = "FETCH_COMPANY_INFO";
    public static FETCH_TARIFFS = "FETCH_TARIFFS";
    public static CHANGE_TARIFF = "CHANGE_TARIFF";
    public static STORE_COMPANY_INFO = "STORE_COMPANY_INFO";
}

export class Mutations {
    public static SET_IS_LOADING = "SET_IS_LOADING";
    public static SET_COMPANY_INFO = "SET_COMPANY_INFO";
    public static SET_TARIFFS = "SET_TARIFFS";
}

export class Getters {
    public static COMPANY_INFO = "COMPANY_INFO";
    public static TARIFFS = "TARIFFS";
    public static IS_LOADING = "IS_LOADING";
}
