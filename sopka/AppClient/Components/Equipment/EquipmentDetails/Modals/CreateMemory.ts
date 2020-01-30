import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IRAMDirectory } from "../../../../Store/Modules/Dictionaries/types";
import { Action, Getter } from "vuex-class";
import { Actions, namespace, Getters } from "../../../../Store/Modules/Dictionaries/constants";
import Footer from "./Shared/Footer/footer.vue";

@Component({
    components: {
        Footer
    }
})
export default class CreateMemory extends Vue {

	@Action(Actions.STORE_EQUIPMENT_MEMORY, { namespace: namespace })
	storeImpl:(model: IRAMDirectory) => Promise<IRAMDirectory>;

	@Prop({ required: true })
	SaveHandler:(result: IRAMDirectory) => void;

	@Getter(Getters.IS_SAVING, { namespace: namespace })
	IsSaving: boolean;

	private model: IRAMDirectory = {
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
					.then((result:IRAMDirectory) => this.SaveHandler(result))
					.catch(error => this.errorText = error);
			}
		});
	}
}