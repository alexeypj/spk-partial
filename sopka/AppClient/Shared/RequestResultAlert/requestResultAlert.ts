import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class RequestResultAlert extends Vue {

    @Prop()
    public readonly errorText: string;

    @Prop()
    public readonly isSaved: boolean;
}
