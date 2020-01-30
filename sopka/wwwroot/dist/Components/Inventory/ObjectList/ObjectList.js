var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ObjectEntry from "./ObjectEntry.vue";
import { Action, State, Mutation, Getter } from "vuex-class";
import { namespace, Actions, Mutations, Getters } from "../../../Store/Modules/Inventory/constants";
let ObjectList = class ObjectList extends Vue {
    clickHandler(id) {
        this.SetSelectedId(id);
        this.$router.push({ path: "/Inventory/" + id.toString() });
    }
    mounted() {
        this.fetchObjectList();
    }
};
__decorate([
    State(namespace)
], ObjectList.prototype, "State", void 0);
__decorate([
    Action(Actions.FETCH_OBJECT_LIST, { namespace })
], ObjectList.prototype, "fetchObjectList", void 0);
__decorate([
    Mutation(Mutations.SET_SELECTED_ID, { namespace })
], ObjectList.prototype, "SetSelectedId", void 0);
__decorate([
    Getter(Getters.SELECTED_ID, { namespace })
], ObjectList.prototype, "SelectedObjectId", void 0);
__decorate([
    Getter(Getters.OBJECTS, { namespace })
], ObjectList.prototype, "Objects", void 0);
ObjectList = __decorate([
    Component({
        components: {
            ObjectEntry
        }
    })
], ObjectList);
export default ObjectList;
//# sourceMappingURL=ObjectList.js.map