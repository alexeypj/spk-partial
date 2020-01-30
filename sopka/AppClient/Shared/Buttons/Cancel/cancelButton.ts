import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class CancelButton extends Vue {

    @Prop({ required: true, default: false })
    public readonly isSaving: boolean;

    @Prop({ default: "btn btn-white"})
    public readonly className: string;

    @Prop({ default: "Отмена" })
    public readonly text: string;
}
