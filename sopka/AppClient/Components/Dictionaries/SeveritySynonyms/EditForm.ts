import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ISeveritySynonymsDirectory, ISeveritySynonymsEditModel } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";
import Footer from "../Shared/Footer/footer.vue";
import Carousel from "../Shared/Carousel/carousel.vue";
import { bootboxLosingChangesConfirmation } from "../../../shared/utils";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";

@Component({
    components: {
        select2,
        Footer,
        Carousel
    }
})
export default class CreateType extends Vue {

	@Action(Actions.STORE_SEVERITY_SYNONYM, {namespace: namespace })
    storeImpl: (model: ISeveritySynonymsEditModel) => Promise<ISeveritySynonymsDirectory>;

    @Getter(Getters.EQUIPMENT_LOG_SEVERITY, { namespace})
    public readonly SeverityDictionary: IDictionaryItem[];

    @Prop({ required: true })
    SaveHandler: (result: ISeveritySynonymsDirectory, closeModal: boolean) => void;

    @Prop({ required: false })
    SelectedObjectType: ISeveritySynonymsDirectory | undefined;

    @Prop({ required: true })
    OnSelectNext: () => void;

    @Prop({ required: true })
    OnSelectPrev: () => void;

	@Prop({ required: true })
    OnAddSeverity: (callback: (severity: IDictionaryItem) => void) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

    private model: ISeveritySynonymsEditModel = {
        NewSeverityId: 0,
        NewSynonym: ""
    };
	private errorText: string = "";

    @Watch('SelectedObjectType', { immediate: true })
    onSelectedObjectTypeChanged(val: ISeveritySynonymsDirectory | undefined, oldVal: ISeveritySynonymsDirectory | undefined): void {
        if (val) {
            this.model.OldSeverityId = val.SeverityId;
            this.model.OldSynonym = val.Synonym;
            this.model.NewSeverityId = val.SeverityId;
            this.model.NewSynonym = val.Synonym;
        } else {
            this.resetModel();
        }
        this.$validator.reset();
    }

    created() {
        this.resetModel();
    }


    get Model(): ISeveritySynonymsEditModel {
        return this.model;
    }

    resetModel() {
        this.model = {
            NewSeverityId: 0,
            NewSynonym: ""
        };
    }

    public storeAndExit(): void {
        this.store(true);
    }

    public store(closeModal: boolean = false): void {
        this.$validator.validateAll().then((result: boolean) => {
            if (result) {
                this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: ISeveritySynonymsDirectory) => {
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
        if (this.model.OldSeverityId && this.model.OldSeverityId > 0) {
            if (this.model.NewSeverityId !== this.SelectedObjectType.SeverityId ||
                this.model.NewSynonym !== this.SelectedObjectType.Synonym) {
                return true;
            }
        } else {
            if (this.model.NewSeverityId || this.model.NewSynonym) {
                return true;
            }
        }
        return false;
    }

    openSeverityModal() {
        this.OnAddSeverity(severity => {
            this.model.NewSeverityId = <number>severity.Key;
        });
    }


    cancel(): void {
        this.resetModel();
        this.$validator.reset();
        this.$emit('cancel', true);
    }
}