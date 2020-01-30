import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { IUserInList } from "../../../Store/Modules/Users/types";

@Component
export default class IsBlockCell extends Vue {
    @Prop({ required: true })
    Item: IUserInList;
}