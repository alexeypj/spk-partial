import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IAttackTypesFilter } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";

@Component
export default class SearchFilter extends Vue {

    @Prop({required: true})
    Filter: IAttackTypesFilter;

    @Prop({required: true})
    ApplyFilter: (filter: IAttackTypesFilter) => void;

    apply() {
        this.ApplyFilter(this.Filter);
    }
}