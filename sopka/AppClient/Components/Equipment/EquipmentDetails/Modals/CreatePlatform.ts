import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IPlatformDirectory } from "../../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
import Footer from "./Shared/Footer/footer.vue";

@Component({
    components: {
        Footer
    }
})
export default class CreatePlatform extends Vue {

	@Action(Actions.STORE_EQUIPMENT_PLATFORM, {namespace: namespace })
	storeImpl:(model: IPlatformDirectory) => Promise<IPlatformDirectory>;

	@Prop({ required: true })
	SaveHandler:(result: IPlatformDirectory) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

	private model: IPlatformDirectory = {
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
					.then((result:IPlatformDirectory) => this.SaveHandler(result))
					.catch(error => this.errorText = error);
			}
		});
	}
}