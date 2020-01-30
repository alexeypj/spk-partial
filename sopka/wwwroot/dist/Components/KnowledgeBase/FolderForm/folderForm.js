var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import select2 from "../../../Shared/Select2/select2.vue";
import Tree from "../Tree/tree.vue";
import { Getter } from "vuex-class";
import { Getters, namespace } from "../../../Store/Modules/KnowledgeBase/constants";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.model = { Id: 0, IdParent: undefined, Title: "" };
        this.selectedParentIds = [];
    }
    onParentIdChange(newVal) {
        if (newVal && newVal.length > 0) {
            this.model.IdParent = Number(newVal[0]);
        }
        else {
            this.model.IdParent = undefined;
        }
        this.update();
    }
    update() {
        this.$emit("update", this.model);
    }
    get foldersDict() {
        return this.folders.map(x => ({ Key: x.Id, Value: x.Title }));
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "folders", void 0);
__decorate([
    Getter(Getters.JSTREE_FOLDERS, { namespace })
], default_1.prototype, "JSTree", void 0);
__decorate([
    Watch("selectedParentIds")
], default_1.prototype, "onParentIdChange", null);
default_1 = __decorate([
    Component({
        components: {
            select2,
            Tree
        }
    })
], default_1);
export default default_1;
//# sourceMappingURL=folderForm.js.map