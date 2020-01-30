import { GetterTree } from "vuex";
import { IKnowledgeBase, IFolder, IKnowledgeBaseDictionaries, IArticle, IKnowledgeBaseFilter } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";
import { IJSTreeItem, IFile } from "../Common/types";

export const getters: GetterTree<IKnowledgeBase, IRootState> = {

    [Getters.FOLDERS](state: IKnowledgeBase): IFolder[] {
        return state.Folders;
    },

    [Getters.IS_LOADING](state: IKnowledgeBase): boolean {
        return state.IsLoading;
    },

    [Getters.DICTIONARIES](state: IKnowledgeBase): IKnowledgeBaseDictionaries {
        return state.Dictionaries;
    },

    [Getters.JSTREE_FULL](state: IKnowledgeBase): IJSTreeItem[] {
        const result = state.Folders.map(x => <IJSTreeItem> {
            id: x.Id.toString(),
            parent: x.IdParent ? x.IdParent.toString() : "#",
            text: x.Title || "(без названия)",
            type: "folder"
        });

        state.Articles.map(x =>
            result.push(<IJSTreeItem> {
            id: "article_" + x.Id!.toString(),
            parent: x.IdFolder.toString(),
            text: x.Title,
            a_attr: {
                title: x.Title,
            },
            type: "file-common"
        }));

        return result;
    },

    [Getters.JSTREE_FOLDERS](state: IKnowledgeBase): IJSTreeItem[] {
        return state.Folders.map(x => <IJSTreeItem> {
            id: x.Id.toString(),
            parent: x.IdParent ? x.IdParent.toString() : "#",
            text: x.Title || "(без названия)",
            type: "folder"
        });
    },

    [Getters.ARTICLES](state: IKnowledgeBase): IArticle[] {
        return state.Articles;
    },

    [Getters.ARTICLE_FILES](state: IKnowledgeBase): IFile[] {
        return state.ArticleFiles;
    },

    [Getters.CURRENT_FILTER](state: IKnowledgeBase): IKnowledgeBaseFilter {
        return state.Filter;
    }

};
