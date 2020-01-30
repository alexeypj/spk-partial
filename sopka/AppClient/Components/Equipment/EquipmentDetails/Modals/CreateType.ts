import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IEquipmentDirectory } from "../../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
import Footer from "./Shared/Footer/footer.vue";

@Component({
    components: {
        Footer
    }
})
export default class CreateType extends Vue {

	@Action(Actions.STORE_EQUIPMENT_TYPE, {namespace: namespace })
	storeImpl:(model: IEquipmentDirectory) => Promise<IEquipmentDirectory>;

	@Prop({ required: true })
	SaveHandler:(result: IEquipmentDirectory) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

	private model: IEquipmentDirectory = {
		Id: 0,
		Title: "",
		Description: ""
	};

	private errorText: string = "";

	public store(): void {
		this.$validator.validateAll().then((result: boolean) => {
			if(result) {
				this.errorText = "";
				this.storeImpl(this.model)
					.then((result:IEquipmentDirectory) => this.SaveHandler(result))
					.catch(error => this.errorText = error);
			}
		});
	}
}