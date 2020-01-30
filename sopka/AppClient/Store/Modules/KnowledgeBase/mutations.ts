import { MutationTree } from "vuex";
import { IKnowledgeBase, IFolder, IKnowledgeBaseDictionaries, IArticle, IKnowledgeBaseFilter } from "./types";
import { Mutations } from "./constants";
import { IFile } from "../Common/types";

export const mutations: MutationTree<IKnowledgeBase> = {

    [Mutations.SET_FOLDER](state: IKnowledgeBase, folders: IFolder[]): void {
        state.Folders = folders;
    },

    [Mutations.SET_IS_LOADING](state: IKnowledgeBase, value: boolean): void {
        state.IsLoading = value;
    },

    [Mutations.SET_DICTIONARIES](state: IKnowledgeBase, dictionaries: IKnowledgeBaseDictionaries): void {
        state.Dictionaries = dictionaries;
    },

    [Mutations.SET_ARTICLES](state: IKnowledgeBase, articles: IArticle[]): void {
        state.Articles = articles;
    },

    [Mutations.SET_ARTICLE_FILES](state: IKnowledgeBase, files: IFile[]): void {
        state.ArticleFiles = files;
    },

    [Mutations.SET_FILTER](state: IKnowledgeBase, filter: IKnowledgeBaseFilter): void {
        state.Filter = filter;
    }
};
