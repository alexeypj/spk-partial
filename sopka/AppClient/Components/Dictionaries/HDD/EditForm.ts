import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IHDDDirectory } from "../../../Store/Modules/Dictionaries/types";
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

	@Action(Actions.STORE_EQUIPMENT_HDD, {namespace: namespace })
    storeImpl: (model: IHDDDirectory) => Promise<IHDDDirectory>;

    @Prop({ required: true })
    SaveHandler: (result: IHDDDirectory, closeModal: boolean) => void;

    @Prop({ required: false })
    SelectedObjectType: IHDDDirectory | undefined;

    @Prop({ required: true })
    OnSelectNext: () => void;

    @Prop({ required: true })
    OnSelectPrev: () => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

    private model: IHDDDirectory = {
        Id: 0,
        Title: "",
        Volume: 0
    };
	private errorText: string = "";

    @Watch('SelectedObjectType', { immediate: true })
    onSelectedObjectTypeChanged(val: IHDDDirectory | undefined, oldVal: IHDDDirectory | undefined): void {
        if (val) {
            this.model.Id = val.Id;
            this.model.Title = val.Title;
            this.model.Volume = val.Volume;
        } else {
            this.resetModel();
        }
        this.$validator.reset();
    }

    created() {
        this.resetModel();
    }


    get Model(): IHDDDirectory {
        return this.model;
    }

    resetModel() {
        this.model.Id = 0;
        this.model.Title = "";
        this.model.Volume = 0;
    }

    public storeAndExit(): void {
        this.store(true);
    }

    public store(closeModal: boolean = false): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: IHDDDirectory) => {
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
            if (this.model.Title !== this.SelectedObjectType.Title ||
                this.model.Volume !== this.SelectedObjectType.Volume) {
                return true;
            }
        } else {
            if (this.model.Title || this.model.Volume) {
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