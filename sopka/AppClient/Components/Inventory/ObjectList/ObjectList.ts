import Vue from "vue";
import { Component } from "vue-property-decorator";
import ObjectEntry from "./ObjectEntry.vue";
import { IInventoryState, IInventoryFilter, IObjectEntry } from "../../../Store/Modules/Inventory/types";
import { Action, State, Mutation, Getter } from "vuex-class";
import { namespace, Actions, Mutations, Getters } from "../../../Store/Modules/Inventory/constants";

@Component({
    components: {
        ObjectEntry
    }
})
export default class ObjectList extends Vue {

    @State(namespace)
    private readonly State: IInventoryState;

    @Action(Actions.FETCH_OBJECT_LIST, { namespace })
    public readonly fetchObjectList: (filter?: IInventoryFilter) => Promise<void>;

    @Mutation(Mutations.SET_SELECTED_ID, { namespace })
    public readonly SetSelectedId: (id: number ) => void;

    @Getter(Getters.SELECTED_ID, { namespace })
    public readonly SelectedObjectId: number|null;

    @Getter(Getters.OBJECTS, { namespace })
    public readonly Objects: IObjectEntry[];

    public clickHandler(id: number): void {
        this.SetSelectedId(id);
        this.$router.push({ path: "/Inventory/" + id.toString() });
    }

    public mounted(): void {
       this.fetchObjectList();
    }
}
