import { GetterTree } from "vuex";
import { IVulnerabilities, IFilter, IVulnerability } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";
import { IFolder } from "../KnowledgeBase/types";
import { IJSTreeItem } from "../Common/types";

export const getters: GetterTree<IVulnerabilities, IRootState> = {

    [Getters.ARE_VULNERABILITIES_LOADING](state: IVulnerabilities): boolean {
        return state.Loading.AreVulnerabilitiesLoading;
    },

    [Getters.ARE_FOLDERS_LOADING](state: IVulnerabilities): boolean {
        return state.Loading.AreFoldersLoading;
    },

    [Getters.IS_VULNERABILITY_LOADING](state: IVulnerabilities): boolean {
        return state.Loading.IsVulnerabilityLoading;
    },

    [Getters.CURRENT_FILTER](state: IVulnerabilities): IFilter {
        return state.Filter;
    },

    [Getters.FOLDERS](state: IVulnerabilities): IFolder[] {
        return state.Folders;
    },

    [Getters.VULNERABILITIES](state: IVulnerabilities): IVulnerability[] {
        return state.Vulnerabilities;
    },

    [Getters.ARE_DICTIONARIES_LOADING](state: IVulnerabilities): boolean {
        return state.Loading.DictionariesLoading;
    },

    [Getters.DICTIONARIES](state: IVulnerabilities) {
        return state.Dictionaries;
    },

    [Getters.JSTREE_FULL](state: IVulnerabilities): IJSTreeItem[] {
        const result = state.Folders.map(x => <IJSTreeItem> {
            id: x.Id.toString(),
            parent: x.IdParent ? x.IdParent.toString() : "#",
            text: x.Title || "(без названия)",
            type: "folder"
        });

        state.Vulnerabilities.map(x =>
            result.push(<IJSTreeItem> {
            id: "article_" + x.Id!.toString(),
            parent: x.IdFolder.toString(),
            text: x.Title,
            type: "file-common"
        }));

        return result;
    },

    [Getters.FOLDER_PATH](state: IVulnerabilities): (folderId: number) => Array<[number, string]> {
        return (folderId: number) => {
            const result: Array<[number, string]> = [];
            let tries = 0;
            let currentFolder = state.Folders.find(x => x.Id === folderId);
            if (currentFolder === undefined) {
                return result;
            }
            while (currentFolder && currentFolder.IdParent && tries < 50) {
                tries++;
                result.push([currentFolder.Id, currentFolder.Title || ""]);
                const parent = currentFolder.IdParent;
                currentFolder = state.Folders.find(x => x.Id === parent);
            }

            if (currentFolder) {
                result.push([currentFolder.Id, currentFolder.Title || ""]);
            }
            return result.reverse();
        };
    },

    [Getters.ARE_COMMENTS_LOADING](state: IVulnerabilities): boolean {
        return state.Loading.CommentsLoading;
    },

    [Getters.IS_COMMENT_SAVING](state: IVulnerabilities): boolean {
        return state.Loading.CommentStoring;
    },

    [Getters.IS_STATUS_SAVING](state: IVulnerabilities): boolean {
        return state.Loading.StatusStoring;
    },

    [Getters.IS_FOLDER_CONTENTS_LOADING](state: IVulnerabilities): boolean {
        return state.Loading.FolderContentsLoading;
    }
};
