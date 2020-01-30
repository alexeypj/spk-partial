import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IEquipmentDirectory } from "../../../Store/Modules/Dictionaries/types";
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

    @Action(Actions.STORE_EQUIPMENT_TYPE, { namespace: namespace })
    storeImpl: (model: IEquipmentDirectory) => Promise<IEquipmentDirectory>;

    @Prop({ required: true })
    SaveHandler: (result: IEquipmentDirectory, closeModal: boolean) => void;

    @Prop({ required: false })
    SelectedObjectType: IEquipmentDirectory | undefined;

    @Prop({ required: true })
    OnSelectNext: () => void;

    @Prop({ required: true })
    OnSelectPrev: () => void;

    @Getter(Getters.IS_SAVING, { namespace: namespace })
    IsSaving: boolean;

    private model: IEquipmentDirectory = {
        Id: 0,
        Title: "",
        Description: ""
    };
    private errorText: string = "";

    @Watch('SelectedObjectType', { immediate: true })
    onSelectedObjectTypeChanged(val: IEquipmentDirectory | undefined, oldVal: IEquipmentDirectory | undefined): void {
        if (val) {
            this.model.Id = val.Id;
            this.model.Title = val.Title;
            this.model.Description = val.Description;
        } else {
            this.resetModel();
        }
        this.$validator.reset();
    }

    created() {
        this.resetModel();
    }


    get Model(): IEquipmentDirectory {
        return this.model;
    }

    resetModel() {
        this.model.Id = 0;
        this.model.Title = "";
        this.model.Description = "";
    }

    public storeAndExit(): void {
        this.store(true);
    }

    public store(closeModal: boolean = false): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: IEquipmentDirectory) => {
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
                this.model.Description !== this.SelectedObjectType.Description) {
                return true;
            }
        } else {
            if (this.model.Title || this.model.Description) {
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