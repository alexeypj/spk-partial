import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IHDDDirectory } from "../../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
import Footer from "./Shared/Footer/footer.vue";

@Component({
    components: {
        Footer
    }
})
export default class CreateHDD extends Vue {

	@Action(Actions.STORE_EQUIPMENT_HDD, { namespace: namespace })
	storeImpl:(model: IHDDDirectory) => Promise<IHDDDirectory>;

	@Prop({ required: true })
	SaveHandler:(result: IHDDDirectory) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

	private model: IHDDDirectory = {
		Id: 0,
		Title: "",
		Volume: 0
	};

	private errorText: string = "";

	public store(): void {
		this.$validator.validateAll().then((result: boolean) => {
			if(result) {
				this.errorText = "";
				this.storeImpl(this.model)
					.then((result:IHDDDirectory) => this.SaveHandler(result))
					.catch(error => this.errorText = error);
			}
		});
	}
}