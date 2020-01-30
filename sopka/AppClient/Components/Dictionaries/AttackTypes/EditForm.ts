import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IAttackTypeDirectory, IIncidentCriticality } from "../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../Store/Modules/Dictionaries/constants";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import CreateCriticality from "./CreateCriticality.vue";
import Footer from "../Shared/Footer/footer.vue";
import Carousel from "../Shared/Carousel/carousel.vue";

@Component({
    components: {
        select2,
        Modal,
        CreateCriticality,
        Footer,
        Carousel
    }
})
export default class CreateType extends Vue {

	@Action(Actions.STORE_ATTACK_TYPE, {namespace: namespace })
    storeImpl: (model: IAttackTypeDirectory) => Promise<IAttackTypeDirectory>;

	@Action(Actions.FETCH_INCIDENT_CRITICALITY_DIC, {namespace: namespace })
    FetchCriticalityDictionary: () => Promise<Array<IIncidentCriticality>>;

	@Prop({ required: true })
    SaveHandler: (result: IAttackTypeDirectory, closeModal: boolean) => void;

    @Prop({ required: false })
    SelectedObjectType: IAttackTypeDirectory | undefined;

	@Prop({ required: true })
    OnSelectNext: () => void;

	@Prop({ required: true })
    OnSelectPrev: () => void;

	@Prop({ required: true })
    OnAddCriticality: (callback: (criticality: IIncidentCriticality) => void) => void;

	@Getter(Getters.INCIDENT_CRITICALITY_DICTIONARY, {namespace: namespace })
    IncidentCriticalityDictionary: IDictionaryItem[];

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

    private model: IAttackTypeDirectory = {
        Id: 0,
        Title: "",
        Description: "",
        CriticalityDefault: 0
    };
	private errorText: string = "";
    private showCriticalityModal: boolean = false;

    @Watch('SelectedObjectType', { immediate: true })
    onSelectedObjectTypeChanged(val: IAttackTypeDirectory | undefined, oldVal: IAttackTypeDirectory | undefined): void {
        if (val) {
            this.model.Id = val.Id;
            this.model.Title = val.Title;
            this.model.Description = val.Description;
            this.model.CriticalityDefault = val.CriticalityDefault;
        } else {
            this.resetModel();
        }
        this.$validator.reset();
    }

    created() {
        this.resetModel();
    }


    get Model(): IAttackTypeDirectory {
        return this.model;
    }

    resetModel() {
        this.model.Id = 0;
        this.model.Title = "";
        this.model.Description = "";
        this.model.CriticalityDefault = 0;
    }

	public storeAndExit(): void {
        this.store(true);
	}

	public store(closeModal: boolean = false): void {
		this.$validator.validateAll().then((result: boolean) => {
			if(result) {
				this.errorText = "";
                this.storeImpl(this.model)
                    .then((result: IAttackTypeDirectory) => {
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
            this.showDropChangesConfirmation(() => {
                this.OnSelectNext();
            });
        } else {
            this.OnSelectNext();
        }
    }

    selectPrev(): void {
        if (this.hasChanges()) {
            this.showDropChangesConfirmation(() => {
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
            if (this.model.Description || this.model.Title) {
                return true;
            }
        }
        return false;
    }

    showDropChangesConfirmation(confirmCallback: () => void) {
        bootbox.confirm({
            message: "Внесенные изменения будут потеряны. Продолжить?",
            animate: false,
            className: "modal-confirmation",
            buttons: {
                confirm: {
                    label: "Да",
                    className: "btn-success"
                },
                cancel: {
                    label: "Отмена",
                    className: "btn-white"
                },

            },
            callback: (result: boolean) => {
                if (result) {
                    confirmCallback();
                }
            }
        });
    }

    openCriticalityModal() {
        this.OnAddCriticality(criticality => {
            this.model.CriticalityDefault = criticality.Id;
        });
    }

    cancel(): void {
        this.resetModel();
        this.$validator.reset();
        this.$emit('cancel', true);
    }
}