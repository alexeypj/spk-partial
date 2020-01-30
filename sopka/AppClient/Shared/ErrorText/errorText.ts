import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class ErrorText extends Vue {

    @Prop()
    public readonly text: string;
}
