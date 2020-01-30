import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IFolder } from "../../../Store/Modules/KnowledgeBase/types";
import select2 from "../../../Shared/Select2/select2.vue";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import Tree from "../Tree/tree.vue";
import { Getter } from "vuex-class";
import { Getters, namespace } from "../../../Store/Modules/KnowledgeBase/constants";
import { IJSTreeItem } from "../../../Store/Modules/Common/types";

@Component({
    components: {
        select2,
        Tree
    }
})
export default class extends Vue {

    @Prop({ required: true })
    public readonly folders: IFolder[];

    @Prop({ default: 0})
    public readonly parentId: string[]|undefined;

    @Getter(Getters.JSTREE_FOLDERS, { namespace })
    public readonly JSTree: IJSTreeItem[];

    @Watch("selectedParentIds")
    public onParentIdChange(newVal: string[]): void {
        if (newVal && newVal.length > 0) {
            this.model.IdParent = Number(newVal[0]);
        } else {
            this.model.IdParent = undefined;
        }
        this.update();
    }

    private model: IFolder = { Id: 0, IdParent: undefined, Title: "" };
    private selectedParentIds: string[] = [];

    public mounted(): void {
        if (this.parentId && this.parentId.length > 0) {
            this.model.IdParent = Number(this.parentId[0]);
            this.selectedParentIds = this.parentId;
            this.$emit("openArticle", this.model.IdParent);
        } else {
            this.model.IdParent = undefined;
        }
    }

    public update(): void {
        this.$emit("update", this.model);
    }

    public get foldersDict(): IDictionaryItem[] {
        return this.folders.map(x => <IDictionaryItem> { Key: x.Id, Value: x.Title });
    }
}
