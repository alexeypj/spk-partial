import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ICompanyListItem } from "Store/Modules/Companies/types";

@Component
export default class SupportCell extends Vue {
    @Prop({ required: true })
    Item: ICompanyListItem;
}