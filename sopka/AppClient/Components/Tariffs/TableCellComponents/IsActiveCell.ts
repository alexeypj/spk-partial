import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ITariffInList } from "../../../Store/Modules/Tariffs/types";

@Component
export default class SupportCell extends Vue {
    @Prop({ required: true })
    Item: ITariffInList;

}