// tslint:disable max-classes-per-file
export const namespace: string = "users";

export class Actions {
    public static FETCH_USER_LIST = "FETCH_USER_LIST";
    public static FETCH_USER = "FETCH_USER";
    public static FETCH_ROLES = "FETCH_ROLES";
    public static STORE_USER = "STORE_USER";
    public static GENERATE_PASSWORD = "GENERATE_PASSWORD";
    public static UPDATE_PASSWORD = "UPDATE_PASSWORD";
    public static BLOCK_USER = "BLOCK_USER";
    public static UNBLOCK_USER = "UNBLOCK_USER";
}

export class Mutations {
    public static SET_IS_LOADING = "SET_IS_LOADING";
    public static SET_USERS = "SET_USERS";
    public static SET_FILTER = "SET_FILTER";
    public static SET_SELECTED_USER_ID = "SET_SELECTED_USER_ID";
    public static SET_ROLES = "SET_ROLES";
    public static SET_USERS_TOTAL = "SET_USERS_TOTAL";
}

export class Getters {
    public static FILTER = "FILTER";
    public static IS_LOADING = "IS_LOADING";
    public static USER_LIST = "USER_LIST";
    public static SELECTED_USER_ID = "SELECTED_USER_ID";
    public static ROLES = "ROLES";
    public static USERS_TOTAL = "USERS_TOTAL";
    public static USER_BY_ID = "USER_BY_ID";
}
