import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ISoftwareDirectory } from "../../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
import Footer from "./Shared/Footer/footer.vue";

@Component({
    components: {
        Footer
    }
})
export default class CreatePlatform extends Vue {

	@Action(Actions.STORE_EQUIPMENT_SOFTWARE, {namespace: namespace })
	storeImpl:(model: ISoftwareDirectory) => Promise<ISoftwareDirectory>;

	@Prop({ required: true })
	SaveHandler:(result: ISoftwareDirectory) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

	private model: ISoftwareDirectory = {
		Id: 0,
		Manufacturer: "",
		Product: ""
	};

	private errorText: string = "";

	public store(): void {
		this.$validator.validateAll().then((result: boolean) => {
			if(result) {
				this.errorText = "";
				this.storeImpl(this.model)
					.then((result:ISoftwareDirectory) => this.SaveHandler(result))
					.catch(error => this.errorText = error);
			}
		});
	}
}