import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { INetworkAdapterDirectory } from "../../../Store/Modules/Dictionaries/types";
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

	@Action(Actions.STORE_EQUIPMENT_NETWORK_ADAPTER, {namespace: namespace })
    storeImpl: (model: INetworkAdapterDirectory) => Promise<INetworkAdapterDirectory>;

    @Prop({ required: true })
    SaveHandler: (result: INetworkAdapterDirectory, closeModal: boolean) => void;

    @Prop({ required: false })
    SelectedObjectType: INetworkAdapterDirectory | undefined;

    @Prop({ required: true })
    OnSelectNext: () => void;

    @Prop({ required: true })
    OnSelectPrev: () => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

    private model: INetworkAdapterDirectory = {
        Id: 0,
        Title: "",
        Speed: 0
    };
	private errorText: string = "";

    @Watch('SelectedObjectType', { immediate: true })
    onSelectedObjectTypeChanged(val: INetworkAdapterDirectory | undefined, oldVal: INetworkAdapterDirectory | undefined): void {
        if (val) {
            this.model.Id = val.Id;
            this.model.Title = val.Title;
            this.model.Speed = val.Speed;
        } else {
            this.resetModel();
        }
        this.$validator.reset();
    }

    created() {
        this.resetModel();
    }


    get Model(): INetworkAdapterDirectory {
        return this.model;
    }

    resetModel() {
        this.model.Id = 0;
        this.model.Title = "";
        this.model.Speed = 0;
        this.errorText = "";
    }

    public storeAndExit(): void {
        this.store(true);
    }

    public store(closeModal: boolean = false): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: INetworkAdapterDirectory) => {
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
                this.model.Speed !== this.SelectedObjectType.Speed) {
                return true;
            }
        } else {
            if (this.model.Title || this.model.Speed) {
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