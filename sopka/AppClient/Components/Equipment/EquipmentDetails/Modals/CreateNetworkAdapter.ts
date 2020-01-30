import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { INetworkAdapterDirectory } from "../../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
import Footer from "./Shared/Footer/footer.vue";

@Component({
    components: {
        Footer
    }
})
export default class CreateNetworkAdapter extends Vue {

	@Action(Actions.STORE_EQUIPMENT_NETWORK_ADAPTER, { namespace: namespace })
	storeImpl:(model: INetworkAdapterDirectory) => Promise<INetworkAdapterDirectory>;

	@Prop({ required: true })
	SaveHandler:(result: INetworkAdapterDirectory) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

	private model: INetworkAdapterDirectory = {
		Id: 0,
		Title: "",
		Speed: 0
	};

	private errorText: string = "";

	public store(): void {
		this.$validator.validateAll().then((result: boolean) => {
			if(result) {
				this.errorText = "";
				this.storeImpl(this.model)
					.then((result:INetworkAdapterDirectory) => this.SaveHandler(result))
					.catch(error => this.errorText = error);
			}
		});
	}
}