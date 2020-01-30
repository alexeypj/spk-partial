import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IOSDirectory } from "../../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
import Footer from "./Shared/Footer/footer.vue";

@Component({
    components: {
        Footer
    }
})
export default class CreateOS extends Vue {

	@Action(Actions.STORE_EQUIPMENT_OS, {namespace: namespace })
	storeImpl:(model: IOSDirectory) => Promise<IOSDirectory>;

	@Prop({ required: true })
	SaveHandler:(result: IOSDirectory) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

	private model: IOSDirectory = {
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
					.then((result:IOSDirectory) => this.SaveHandler(result))
					.catch(error => this.errorText = error);
			}
		});
	}
}