import { Mutations } from "./constants";
export const mutations = {
    [Mutations.SET_FOLDER](state, folders) {
        state.Folders = folders;
    },
    [Mutations.SET_IS_LOADING](state, value) {
        state.IsLoading = value;
    },
    [Mutations.SET_DICTIONARIES](state, dictionaries) {
        state.Dictionaries = dictionaries;
    },
    [Mutations.SET_ARTICLES](state, articles) {
        state.Articles = articles;
    },
    [Mutations.SET_ARTICLE_FILES](state, files) {
        state.ArticleFiles = files;
    },
    [Mutations.SET_FILTER](state, filter) {
        state.Filter = filter;
    }
};
//# sourceMappingURL=mutations.js.map