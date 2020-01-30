import { Getters } from "./constants";
export const getters = {
    [Getters.FOLDERS](state) {
        return state.Folders;
    },
    [Getters.IS_LOADING](state) {
        return state.IsLoading;
    },
    [Getters.DICTIONARIES](state) {
        return state.Dictionaries;
    },
    [Getters.JSTREE_FULL](state) {
        const result = state.Folders.map(x => ({
            id: x.Id.toString(),
            parent: x.IdParent ? x.IdParent.toString() : "#",
            text: x.Title || "(без названия)",
            type: "folder"
        }));
        state.Articles.map(x => result.push({
            id: "article_" + x.Id.toString(),
            parent: x.IdFolder.toString(),
            text: x.Title,
            type: "file-common"
        }));
        return result;
    },
    [Getters.JSTREE_FOLDERS](state) {
        return state.Folders.map(x => ({
            id: x.Id.toString(),
            parent: x.IdParent ? x.IdParent.toString() : "#",
            text: x.Title || "(без названия)",
            type: "folder"
        }));
    },
    [Getters.ARTICLES](state) {
        return state.Articles;
    },
    [Getters.ARTICLE_FILES](state) {
        return state.ArticleFiles;
    },
    [Getters.CURRENT_FILTER](state) {
        return state.Filter;
    }
};
//# sourceMappingURL=getters.js.map