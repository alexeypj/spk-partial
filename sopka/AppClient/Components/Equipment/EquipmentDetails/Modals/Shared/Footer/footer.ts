import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class Footer extends Vue {

    @Prop({ default: false})
    public readonly IsSaving: boolean;
}
