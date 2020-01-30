// tslint:disable max-classes-per-file
export const namespace: string = "common";

export const losingChangesConfirmation = "Внесенные изменения будут потеряны. Продолжить?";
export const noFilePreview = "Предварительный просмотр недоступен для файлов данного типа";

export class Actions {
    public static FETCH_FILE_INFO = "FETCH_FILE_INFO";
    public static FETCH_SETTINGS = "FETCH_SETTINGS";
    public static FETCH_FILE_LIST = "FETCH_FILE_LIST";
}

export class Mutations {
    public static SET_SETTINGS = "SET_SETTINGS";
    public static SET_FILE_LIST_LOADING = "SET_FILE_LIST_LOADING";
}

export class Getters {
    public static IS_ADMIN = "IS_ADMIN";
    public static IS_COMPANY_ADMIN = "IS_COMPANY_ADMIN";
    public static CURRENT_USER = "CURRENT_USER";
    public static IS_AUTHENTICATED = "IS_AUTHENTICATED";
    public static ASSEMBLY = "ASSEMBLY";
    public static SETTINGS = "SETTINGS";
    public static HAS_ROLE = "HAS_ROLE";
    public static IS_FILE_LIST_LOADING = "IS_FILE_LIST_LOADING";
    public static IS_SUPER_ADMIN_OR_PAID = "IS_SUPER_ADMIN_OR_PAID";
}
