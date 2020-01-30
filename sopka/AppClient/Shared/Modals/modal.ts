import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
	components: {}
})
export default class Modal extends Vue {
	@Prop()
	title: string;

	@Prop()
	description: string;

	@Prop({ default: "OK" })
	okText: string;

	@Prop({ default: "Отмена" })
	cancelText: string;

	@Prop({ default: "600px" })
	width: string;

	@Prop({ default: "auto" })
	min_height: string;

	@Prop({ default: true })
	showFooter: boolean;

	@Prop({default: "normal"})
	animationSpeed: string;

	@Prop({default: "modal-standard"})
	className: string;

	@Prop({default: ""})
	maskCssClass: string;

    mounted(): void {
        
		document.addEventListener("keydown", (ev: KeyboardEvent) => {
			if((ev.key === "Escape" || ev.key === "Esc")) {
				ev.preventDefault();
				this.$emit("cancel", true);
			}
		});
	}
}

//$("#myModal").draggable({
//    handle: ".modal-header"
//});