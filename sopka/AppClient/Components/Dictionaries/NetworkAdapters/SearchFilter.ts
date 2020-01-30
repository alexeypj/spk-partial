import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { INetworkAdapterFilter } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";

@Component
export default class SearchFilter extends Vue {

    @Prop({required: true})
    Filter: INetworkAdapterFilter;

    @Prop({required: true})
    ApplyFilter: (filter: INetworkAdapterFilter) => void;

    apply() {
        this.ApplyFilter(this.Filter);
    }
}