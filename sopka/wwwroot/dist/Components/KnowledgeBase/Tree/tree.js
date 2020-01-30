var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
let default_1 = class default_1 extends Vue {
    onFoldersChange(newData) {
        this.$target.jstree("destroy");
        this.init(newData);
    }
    onValueChange(newVal) {
        if (newVal) {
            this.$target.jstree().open_node(newVal);
        }
    }
    onParentOpenArticle(articleId, elementId) {
        if ((elementId && elementId === this.$el.getAttribute("id")) || !elementId) {
            const $tree = this.$target;
            $tree.on("ready.jstree", () => {
                $tree.jstree().deselect_all();
                $tree.jstree().select_node(articleId);
            });
        }
    }
    mounted() {
        this.$target = $("#" + this.$el.getAttribute("id") || "jstree");
        this.init(this.Folders);
        this.$parent.$on("openArticle", this.onParentOpenArticle);
    }
    beforeDestroy() {
        this.$parent.$off("openArticle");
        this.$target.jstree("destroy");
    }
    init(data) {
        this.$target.jstree({
            core: {
                data
            },
            types: {
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
            plugins: ["sort", "types"],
            strings: {
                "Loading ...": "Данные загружаются ...",
            }
        });
        this.$target.on("select_node.jstree", (node, selected) => {
            if (selected && selected.node) {
                if (selected.node.type !== "folder") {
                    this.$emit("selectFile", selected.selected[0]);
                    return;
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
};
__decorate([
    Prop()
], default_1.prototype, "value", void 0);
__decorate([
    Prop({ required: true })
], default_1.prototype, "Folders", void 0);
__decorate([
    Watch("Folders")
], default_1.prototype, "onFoldersChange", null);
__decorate([
    Watch("value")
], default_1.prototype, "onValueChange", null);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=tree.js.map