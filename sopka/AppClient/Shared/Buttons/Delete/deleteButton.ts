import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class DeleteButton extends Vue {

    @Prop({ required: true, default: false })
    public readonly isSaving: boolean;

    @Prop({ default: "btn btn-danger"})
    public readonly className: string;

    @Prop({ default: "Удалить" })
    public readonly text: string;

    @Prop({ default: "объект"})
    public readonly name: string;

    private onClick($event): void {
        bootbox.confirm({
            message: `Вы уверены, что хотите удалить <strong>${this.name}</strong>?`,
            animate: false,
            className: "bootbox-remove",
            buttons: {
                confirm: {
                    label: "Удалить",
                    className: "btn-danger"
                },
                cancel: {
                    label: "Отмена",
                    className: "btn-white"
                }
            },
            callback: (result: boolean) => {
                if (result) {
                    this.$emit("click", $event);
                }
            }
        });
    }

}
