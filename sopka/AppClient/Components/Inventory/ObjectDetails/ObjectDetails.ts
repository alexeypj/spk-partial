import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IObjectEntry, IDictionaryItem, IAddress, hasChanges } from "../../../Store/Modules/Inventory/types";
import { Getter, Action } from "vuex-class";
import { Actions, Getters, namespace } from "../../../Store/Modules/Inventory/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import { Getters as commonGetters, namespace as commonNamespace, losingChangesConfirmation } from "../../../Store/Modules/Common/constants";
import { removeConfirmation } from "../../../shared/utils";

@Component({
    components: {
        select2
    }
})
export default class ObjectDetails extends Vue {

    @Getter(Getters.SELECTED_OBJECT, { namespace })
    public readonly SelectedObject: IObjectEntry;

    @Getter(Getters.SELECTED_ID, { namespace })
    public readonly SelectedId: number | null;

    @Action(Actions.FETCH_OBJECT_DICTIONARIES, { namespace })
    public readonly FetchDictionaries: () => Promise<void>;

    @Getter(Getters.DICTIONARY_BRANCH, { namespace })
    public readonly Branches: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_OBJECT_TYPES, { namespace })
    public readonly ObjectTypes: IDictionaryItem[];

    @Action(Actions.FETCH_OBJECT, { namespace })
    public readonly FetchObject: (id: number) => Promise<IObjectEntry>;

    @Action(Actions.REMOVE_OBJECT, { namespace })
    public readonly RemoveObject: (id: number) => Promise<boolean>;

    @Action(Actions.STORE_OBJECT, { namespace })
    public readonly StoreObject: (model: IObjectEntry) => Promise<IObjectEntry|string[]>;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Prop()
    public address: IAddress;

    @Prop()
    public ObjectName: string;

    @Prop({ default: true})
    public IsReadonly: boolean;

    @Watch("address")
    private onAddressChange(newVal: IAddress) {
        if (newVal.Address) {
            this.model.ObjectAddress = newVal.Address;
        }
        this.model.Latitude = newVal.Latitude;
        this.model.Longitude = newVal.Longitude;
    }

    private model: IObjectEntry = <IObjectEntry> {};
    private errorText: string = "";
    private isSaved: boolean = false;

    private unsubscribe: () => void;

    public mounted(): void {
        this.FetchDictionaries().then(() => this.model = <IObjectEntry> {...this.SelectedObject });
        if (this.SelectedId) {
            this.FetchObject(this.SelectedId);
        }

        this.$parent.$on("store", () => this.store());
        this.$parent.$on("remove", () => this.remove());

        this.unsubscribe = this.$store.watch(() => this.$store.getters[namespace + "/" + Getters.SELECTED_OBJECT], () => {
            this.model = <IObjectEntry> {...this.SelectedObject };
            this.$nextTick(() => this.$validator.reset());
        });

        window.addEventListener("beforeunload", this.onHasChanges);
    }

    public beforeDestroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.$parent.$off("store");
        this.$parent.$off("remove");
        window.removeEventListener("beforeunload", this.onHasChanges);
    }

    public onHasChanges(event: Event): string|undefined {
        if (hasChanges(this.model, this.SelectedObject)) {
            event.preventDefault();
            event.returnValue = false;
            return losingChangesConfirmation;
        }
        return;
    }

    private get isNew(): boolean {
        return !this.SelectedObject.Id || (this.SelectedObject && this.SelectedObject.Id === 0);
    }

    private mapSearch(): void {
        this.$emit("mapSearch", this.model.ObjectAddress);
    }

    private checkCoordinates(): void {
        if (this.model.Latitude && this.model.Longitude) {
            this.$emit("changedCoordinates", this.model.Latitude, this.model.Longitude);
        }
    }

    private get branchName(): string {
        if (this.model.IdBranch) {
            const result = this.Branches.find(x => x.Key === this.model.IdBranch);
            if (result) {
                return result.Value;
            }
        }
        return "";
    }

    private get typeName(): string {
        if (this.model.IdType) {
            const result = this.ObjectTypes.find(x => x.Key === this.model.IdType);
            if (result) {
                return result.Value;
            }
        }
        return "";
    }

    private store(): void {
        if (this.model.Id > 0) {
            this.model.ObjectName = this.ObjectName;
        }
        this.$validator.validateAll().then((valid) => {
            if (valid) {
                this.StoreObject(this.model)
                    .then((result) => {
                        this.errorText = "";
                        const objResult: IObjectEntry = result as IObjectEntry;
                        if (objResult.Id) {
                            this.isSaved = true;
                            this.$emit("onStore", objResult.Id);
                            setTimeout(() => this.isSaved = false, 5000);
                            if (this.model.Id > 0) {
                                this.FetchObject(objResult.Id);
                            }
                        }
                    }).catch((error) => this.errorText = error);
            }
        });
    }

	private CopyF(idinp): void {
		$("#" + idinp).select();
		document.execCommand("copy");
	}

    private remove(): void {
        removeConfirmation(
            `Вы уверены, что хотите удалить <strong>${this.model.ObjectName}</strong>?`,
            () => {
                this.RemoveObject(this.model.Id)
                    .then((success: boolean) => {
                        if (success) {
                            this.$emit("refreshList");
                        }
                    })
                    .catch((error) => this.errorText = error);
            }
        );
    }
}
