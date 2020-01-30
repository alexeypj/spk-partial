import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IOSDirectory } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";
import Footer from "../Shared/Footer/footer.vue";
import Carousel from "../Shared/Carousel/carousel.vue";
import { bootboxLosingChangesConfirmation } from "../../../shared/utils";

@Component({
    components: {
        Footer,
        Carousel
    }
})
export default class CreateType extends Vue {

	@Action(Actions.STORE_EQUIPMENT_OS, {namespace: namespace })
    storeImpl: (model: IOSDirectory) => Promise<IOSDirectory>;

    @Prop({ required: true })
    SaveHandler: (result: IOSDirectory, closeModal: boolean) => void;

    @Prop({ required: false })
    SelectedObjectType: IOSDirectory | undefined;

    @Prop({ required: true })
    OnSelectNext: () => void;

    @Prop({ required: true })
    OnSelectPrev: () => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

    private model: IOSDirectory = {
        Id: 0,
        Product: "",
        Manufacturer: ""
    };
	private errorText: string = "";

    @Watch('SelectedObjectType', { immediate: true })
    onSelectedObjectTypeChanged(val: IOSDirectory | undefined, oldVal: IOSDirectory | undefined): void {
        if (val) {
            this.model.Id = val.Id;
            this.model.Product = val.Product;
            this.model.Manufacturer = val.Manufacturer;
        } else {
            this.resetModel();
        }
        this.$validator.reset();
    }

    created() {
        this.resetModel();
    }


    get Model(): IOSDirectory {
        return this.model;
    }

    resetModel() {
        this.model.Id = 0;
        this.model.Product = "";
        this.model.Manufacturer = "";
    }

    public storeAndExit(): void {
        this.store(true);
    }

    public store(closeModal: boolean = false): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: IOSDirectory) => {
                        if (closeModal) {
                            this.resetModel();
                            this.$validator.reset();
                        }
                        if (this.SaveHandler) {
                            this.SaveHandler(result, closeModal);
                        }
                    })
                    .catch(error => this.errorText = error);
            }
        });
    }

    selectNext(): void {
        if (this.hasChanges()) {
            bootboxLosingChangesConfirmation(() => {
                this.OnSelectNext();
            });
        } else {
            this.OnSelectNext();
        }
    }

    selectPrev(): void {
        if (this.hasChanges()) {
            bootboxLosingChangesConfirmation(() => {
                this.OnSelectPrev();
            });
        } else {
            this.OnSelectPrev();
        }
    }

    hasChanges(): boolean {
        if (!this.SelectedObjectType) {
            return false;
        }
        if (this.model.Id > 0) {
            if (this.model.Manufacturer !== this.SelectedObjectType.Manufacturer ||
                this.model.Product !== this.SelectedObjectType.Product) {
                return true;
            }
        } else {
            if (this.model.Manufacturer || this.model.Product) {
                return true;
            }
        }
        return false;
    }

    cancel(): void {
        this.resetModel();
        this.$validator.reset();
        this.$emit('cancel', true);
    }
}