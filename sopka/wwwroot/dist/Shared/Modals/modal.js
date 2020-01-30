var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
let Modal = class Modal extends Vue {
    mounted() {
        document.addEventListener("keydown", (ev) => {
            if ((ev.key === "Escape" || ev.key === "Esc")) {
                ev.preventDefault();
                this.$emit("cancel", true);
            }
        });
    }
};
__decorate([
    Prop()
], Modal.prototype, "title", void 0);
__decorate([
    Prop()
], Modal.prototype, "description", void 0);
__decorate([
    Prop({ default: "OK" })
], Modal.prototype, "okText", void 0);
__decorate([
    Prop({ default: "Отмена" })
], Modal.prototype, "cancelText", void 0);
__decorate([
    Prop({ default: "600px" })
], Modal.prototype, "width", void 0);
__decorate([
    Prop({ default: "auto" })
], Modal.prototype, "min_height", void 0);
__decorate([
    Prop({ default: true })
], Modal.prototype, "showFooter", void 0);
__decorate([
    Prop({ default: "normal" })
], Modal.prototype, "animationSpeed", void 0);
__decorate([
    Prop({ default: "modal-standard" })
], Modal.prototype, "className", void 0);
__decorate([
    Prop({ default: "" })
], Modal.prototype, "maskCssClass", void 0);
Modal = __decorate([
    Component({
        components: {}
    })
], Modal);
export default Modal;
//$("#myModal").draggable({
//    handle: ".modal-header"
//});
//# sourceMappingURL=modal.js.map