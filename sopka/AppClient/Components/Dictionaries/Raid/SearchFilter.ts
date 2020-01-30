import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IRaidFilter } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";

@Component
export default class SearchFilter extends Vue {

    @Prop({required: true})
    Filter: IRaidFilter;

    @Prop({required: true})
    ApplyFilter: (filter: IRaidFilter) => void;

    apply() {
        this.ApplyFilter(this.Filter);
    }
}