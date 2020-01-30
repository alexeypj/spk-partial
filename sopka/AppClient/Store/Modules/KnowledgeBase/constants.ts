// tslint:disable max-classes-per-file
export const namespace: string = "knowledgeBase";

export class Actions {
    public static STORE_FOLDER = "STORE_FOLDER";
    public static FETCH_FOLDERS = "FETCH_FOLDERS";
    public static FETCH_DICTIONARIES = "FETCH_DICTIONARIES";
    public static STORE_ARTICLE = "STORE_ARTICLE";
    public static FETCH_ARTICLES = "FETCH_ARTICLES";
    public static FETCH_ARTICLE = "FETCH_ARTICLE";
    public static REMOVE_FILE = "REMOVE_FILE";
    public static FETCH_ATTACHED_INCIDENTS = "FETCH_ATTACHED_INCIDENTS";
    public static REMOVE_ARTICLE = "REMOVE_ARTICLE";
}

export class Mutations {
    public static SET_FOLDER = "SET_FOLDER";
    public static SET_IS_LOADING = "SET_IS_LOADING";
    public static SET_DICTIONARIES = "SET_DICTIONARIES";
    public static SET_ARTICLES = "SET_ARTICLES";
    public static SET_ARTICLE_FILES = "SET_ARTICLE_FILES";
    public static SET_FILTER = "KB_SET_FILTER";
}

export class Getters {
    public static FOLDERS = "FOLDERS";
    public static IS_LOADING = "IS_LOADING";
    public static DICTIONARIES = "DICTIONARIES";
    public static JSTREE_FOLDERS = "JSTREE_FOLDERS";
    public static JSTREE_FULL = "JSTREE_FULL";
    public static ARTICLES = "ARTICLES";
    public static ARTICLE_FILES = "ARTICLE_FILES";
    public static CURRENT_FILTER = "KB_CURRENT_FILTER";
}
