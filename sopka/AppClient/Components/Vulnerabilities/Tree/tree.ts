import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { IJSTreeItem } from "../../../Store/Modules/Common/types";

@Component
export default class extends Vue {

    @Prop()
    public readonly value: string;

    @Prop({required: true})
    public readonly Folders: IJSTreeItem[];

    private $target: JQuery<HTMLElement>;

    @Watch("Folders")
    public onFoldersChange(newData: IJSTreeItem[]): void {
        this.$target.jstree("destroy");
        this.init(newData);
    }

    @Watch("value")
    public onValueChange(newVal: string): void {
        if (newVal) {
            this.$target.jstree().open_node(newVal);
        }
    }

    private onParentOpenArticle(articleId: string, elementId?: string): void {
        if ((elementId && elementId === this.$el.getAttribute("id")) || !elementId) {
            const $tree = this.$target;
            $tree.on("ready.jstree", () => {
                $tree.jstree().deselect_all();
                $tree.jstree().select_node(articleId);
            });
        }
    }

    public mounted(): void {
        this.$target = $("#" + this.$el.getAttribute("id") || "jstree");
        this.init(this.Folders);
        this.$parent.$on("openArticle", this.onParentOpenArticle);
    }

    public beforeDestroy(): void {
        this.$parent.$off("openArticle");
        this.$target.jstree("destroy");
    }

    private init(data: IJSTreeItem[]): void {
        this.$target.jstree({
            core: {
                data
            },
            types : {
                "file-common": {
                    icon: "fa fa-file-text-o"
                },
                "file-pdf": {
                    icon: "fa fa-file-pdf-o"
                },
                "file-doc": {
                    icon: "fa fa-file-word-o"
                },
                "file-xls": {
                    icon: "fa fa-file-excel-o"
                },
                "file-txt": {
                    icon: "fa fa-file-text-o"
                },
                "file-img": {
                    icon: "fa fa-file-image-o"
                },
                "file-ppt": {
                    icon: "fa fa-file-powerpoint-o"
                },
                "folder": {
                    icon: "fa fa-folder"
                }
            },
            plugins : ["sort", "types"],
            strings: {
                "Loading ..." : "Данные загружаются ...",
            }
        });

        this.$target.on("select_node.jstree", (node, selected) => {
            if (selected && selected.node) {
                if (selected.node.type !== "folder") {
                    this.$emit("selectFile", selected.selected[0]);
                    return;
                } else {
                    this.$emit("selectFolder", selected.selected[0]);
                }
            }
            this.$emit("input", selected.selected);
        });

        if (this.value) {
            const $tree = this.$target;
            $tree.on("ready.jstree", () => {
                this.$target.jstree(true).select_node("#" + this.value);
            });
        }
    }
}
