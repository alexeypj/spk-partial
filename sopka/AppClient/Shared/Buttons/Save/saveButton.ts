import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class StoreButton extends Vue {

    @Prop({ required: true, default: false })
    public readonly isSaving: boolean;

    @Prop({ default: "btn btn-success"})
    public readonly className: string;

    @Prop({ default: "Сохранить" })
    public readonly enabledText: string;

    @Prop({ default: "Сохранение"})
    public readonly disabledText: string;
}
