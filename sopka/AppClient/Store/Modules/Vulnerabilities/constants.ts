// tslint:disable max-classes-per-file
export const namespace: string = "vulnerabilities";

export class Actions {
    public static FETCH_FOLDERS = "FETCH_FOLDERS";
    public static FETCH_VULNERABILITIES = "FETCH_VULNERABILITIES";
    public static FETCH_VULNERABILITY = "FETCH_VULNERABILITY";
    public static FETCH_DICTIONARIES = "FETCH_DICTIONARIES";
    public static STORE_COMMENT = "STORE_COMMENT";
    public static FETCH_COMMENTS = "FETCH_COMMENTS";
    public static SET_STATUS = "SET_STATUS";
    public static FETCH_FOLDER_CONTENTS = "FETCH_FOLDER_CONTENTS";
}

export class Mutations {
    public static SET_FOLDERS = "SET_FOLDERS";
    public static SET_FOLDERS_ARE_LOADING = "SET_FOLDERS_ARE_LOADING";
    public static SET_VULNERABILITIES = "SET_VULNERABILITIES";
    public static SET_VULNERABILITIES_ARE_LOADING = "SET_VULNERABILITIES_ARE_LOADING";
    public static SET_VULNERABILITY = "SET_VULNERABILITY";
    public static SET_VULNERABILITY_IS_LOADING = "SET_VULNERABILITY_IS_LOADING";
    public static SET_FILTER = "SET_FILTER";
    public static SET_DICTIONARIES = "SET_DICTIONARIES";
    public static SET_DICTIONARIES_ARE_LOADING = "SET_DICTIONARIES_ARE_LOADING";
    public static SET_COMMENTS_ARE_LOADING = "SET_COMMENTS_ARE_LOADING";
    public static SET_COMMENT_IS_SAVING = "SET_COMMENT_IS_SAVING";
    public static SET_STATUS_IS_SAVING = "SET_STATUS_IS_SAVING";
    public static SET_FOLDER_CONTENTS_LOADING = "SET_FOLDER_CONTENTS_LOADING";
}

export class Getters {
    public static ARE_VULNERABILITIES_LOADING = "ARE_VULNERABILITIES_LOADING";
    public static IS_VULNERABILITY_LOADING = "IS_VULNERABILITY_LOADING";
    public static ARE_FOLDERS_LOADING = "ARE_FOLDERS_LOADING";
    public static CURRENT_FILTER = "CURRENT_FILTER";
    public static FOLDERS = "FOLDERS";
    public static VULNERABILITIES = "VULNERABILITIES";
    public static JSTREE_FULL = "JSTREE_FULL";
    public static DICTIONARIES = "DICTIONARIES";
    public static ARE_DICTIONARIES_LOADING = "ARE_DICTIONARIES_LOADING";
    public static FOLDER_PATH = "FOLDER_PATH";
    public static ARE_COMMENTS_LOADING = "ARE_COMMENTS_LOADING";
    public static IS_COMMENT_SAVING = "IS_COMMENT_SAVING";
    public static IS_STATUS_SAVING = "IS_STATUS_SAVING";
    public static IS_FOLDER_CONTENTS_LOADING = "IS_FOLDER_CONTENTS_LOADING";

}
