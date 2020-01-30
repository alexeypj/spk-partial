import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Mutation, Getter, Action } from "vuex-class";
import { Mutations, namespace, Getters, Actions } from "../../../Store/Modules/Inventory/constants";
import { IDevice,
         IDictionaryItem,
         IEquipment,
         IMemory,
         IOperationSystem,
         ISoftware,
         IHDD,
         INetworkAdapter } from "../../../Store/Modules/Inventory/types";
import map from "lodash/map";
import find from "lodash/find";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";
import moment from "moment";
import Modal from "../../../Shared/Modals/modal.vue";
import CreateType from "./Modals/CreateType.vue";
import CreatePlatform from "./Modals/CreatePlatform.vue";
import CreateProcessor from "./Modals/CreateProcessor.vue";
import CreateMemory from "./Modals/CreateMemory.vue";
import CreateHDD from "./Modals/CreateHDD.vue";
import CreateNetworkAdapter from "./Modals/CreateNetworkAdapter.vue";
import CreateSoftware from "./Modals/CreateSoftware.vue";
import CreateOS from "./Modals/CreateOS.vue";
import { IEquipmentDirectory,
         ICPUDirectory,
         IRAMDirectory,
         INetworkAdapterDirectory,
         IHDDDirectory } from "../../../Store/Modules/Dictionaries/types";

import { formatDate as _formatDate, logAction } from "../../../Shared/utils";
import select2 from "../../../Shared/Select2/select2.vue";
import { Getters as commonGetters, namespace as commonNamespace } from "../../../Store/Modules/Common/constants";
import { LogActions, EntityType } from "../../../Shared/LogActions";
import { ISopkaSettings } from "../../../Store/Modules/Common/types";

@Component({
    components: {
        DatePick,
        Modal,
        select2,
        CreateType,
        CreatePlatform,
        CreateProcessor,
        CreateMemory,
        CreateHDD,
        CreateNetworkAdapter,
        CreateSoftware,
        CreateOS
    }
})
export default class EquipmentDetails extends Vue {

    @Prop()
    public readonly Id: number | null;

    @Prop({default: 0})
    public readonly ObjectId: number;

    @Prop({ default: false })
    public readonly Readonly: boolean;

    private readonly: boolean = false;

    @Mutation(Mutations.SET_DEVICE, { namespace })
    public readonly  SetDevice: (device: IDevice) => void;

    @Action(Actions.FETCH_DEVICE_DICTIONARIES, { namespace })
    public readonly FetchDictionaries: () => Promise<void>;

    @Action(Actions.STORE_EQUIPMENT, { namespace })
    public readonly StoreEquipment: (model: IEquipment) => Promise<IEquipment | string[]>;

    @Action(Actions.FETCH_EQUIPMENT, { namespace })
    public readonly FetchEquipment: (id: number) => Promise<IEquipment>;

    @Getter(Getters.EQUIPMENT, { namespace })
    public readonly Equipment: IEquipment;

    @Getter(Getters.DICTIONARY_DEVICE_TYPES, { namespace })
    public readonly DeviceTypes: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_PLATFORMS, { namespace })
    public readonly Platforms: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_OBJECTS, { namespace })
    public readonly Objects: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_RAID_TYPES, { namespace })
    public readonly RaidTypes: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_CPU, { namespace })
    public readonly CPU: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_MEMORY, { namespace })
    public readonly Memory: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_OS, { namespace })
    public readonly OS: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_SOFTWARE, { namespace })
    public readonly Software: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_HDD, { namespace })
    public readonly HDD: IDictionaryItem[];

    @Getter(Getters.DICTIONARY_NETWORK_ADAPTERS, { namespace })
    public readonly NetworkAdapters: IDictionaryItem[];

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Action(Actions.REMOVE_EQUIPMENT, { namespace })
    public RemoveEquipment: (id: number) => Promise<void>;

    @Getter(Getters.CHECK_PERIOD_DICTIONARY, { namespace })
    public readonly RecordsCheckPeriods: IDictionaryItem[];

    @Getter(commonGetters.SETTINGS, { namespace: commonNamespace  })
    public readonly Settings: ISopkaSettings;

    private model: IEquipment = <IEquipment> {
        Platform: 0,
        Type: 0
    };
    private deviceModel: IDevice = <IDevice> {
        Id: 0,
        IdEquipment: 0,
        HDD: [],
        Memory: [],
        OperationSystems: [],
        Software: [],
        NetworkAdapters: [],
        IdCPU: undefined,
        CPUCount: undefined
    };

    private unsubscribe: () => void;

    private isSaved: boolean = false;
    private errorText: string = "";

    //#region Modals
    private showCreateTypeModal: boolean = false;
    private showCreatePlatformModal: boolean = false;
    private showCreateProcessorModal: boolean = false;
    private showCreateMemoryModal: boolean = false;
    /** Номер в массиве объектов, для которого создается новый элемент */
    private createValueFor: number = 0;
    private showCreateHDDModal: boolean = false;
    private showCreateNetworkAdapterModal: boolean = false;
    private showCreateSoftwareModal: boolean = false;
    private showCreateOSModal: boolean = false;
    //#endregion

    public mounted(): void {
        this.FetchDictionaries()
            .then(() => {
                if (this.getEquipment() === false) {
                    this.model.IdObject = Number(this.ObjectId);
                }
            });

        this.unsubscribe = this.$store.watch(() => this.$store.getters[namespace + "/" + Getters.SELECTED_EQUIPMENT_ID], () => {
            this.getEquipment();
            this.$nextTick(() => this.$validator.reset());
        });

        this.readonly = this.Readonly;
    }

    private getEquipment(): boolean {
        const equipmentId: number = Number(this.Id) || 0;
        if (equipmentId !== 0) {
            this.FetchEquipment(equipmentId)
                .then((result: IEquipment) => {
                    this.model = result;
                    this.deviceModel = result.Devices[0];
                    if (this.deviceModel.AWZDate) {
                        const m: moment.Moment = moment(this.deviceModel.AWZDate);
                        this.deviceModel.AWZDate = m.format("YYYY-MM-DD HH:mm");
                    }
                    logAction(LogActions.EquipmentItem, EntityType.Equipment, result.Id.toString(), null, result.Name);
                });
            return true;
        }
        return false;
    }

    public beforeDestroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    public store(e: Event): void {
        e.preventDefault();
        this.$validator.validateAll().then((valid) => {
            if (valid) {
                this.errorText = "";
                this.model.Devices = [this.deviceModel];
                this.StoreEquipment(this.model)
                    .then((result) => {
                        const objResult: IEquipment = result as IEquipment;
                        if (objResult.Id) {
                            this.isSaved = true;
                            this.model = objResult;
                            this.deviceModel = this.model.Devices[0];
                            if (this.deviceModel.AWZDate) {
                                const m: moment.Moment = moment(this.deviceModel.AWZDate);
                                this.deviceModel.AWZDate = m.format("YYYY-MM-DD HH:mm");
                            }
                            setTimeout(() => this.isSaved = false, 5000);
                            this.$emit("store", objResult.Id);
                        }
                    })
                    .catch((error) => this.errorText = error);
            }
        });
    }

    public cancel(e: Event): void {
        e.preventDefault();
        if (this.readonly || this.Id === 0) {
            this.$emit("cancelEdit", this.readonly);
        } else {
            this.getEquipment();
            this.readonly = true;
        }
    }

    public addProcessorSlot(): void {
        this.deviceModel.IdCPU = 0;
        this.deviceModel.CPUCount = 1;
    }

    public clearProcessor(): void {
        this.deviceModel.IdCPU = undefined;
        this.deviceModel.CPUCount = undefined;
    }

    public get memoryValues(): IDictionaryItem[] {
        const result: IDictionaryItem[] = [];
        const includesValues: string[] = [];
        map(this.Memory, (x) => {
            if (includesValues.indexOf(x.Value) === -1) {
                result.push(x);
                includesValues.push(x.Value);
            }
        });
        return result;
    }

    public addMemorySlot(): void {
        this.deviceModel.Memory.push(<IMemory> {
            IdRAMDirectory: 0,
            Count: 1
        });
    }

    public removeMemorySlot(idx: number): void {
        this.deviceModel.Memory.splice(idx, 1);
    }

    public addOSSlot(): void {
        this.deviceModel.OperationSystems.push(<IOperationSystem> {
            IdOSDirectory: 0
        });
    }

    public removeOSSlot(idx: number): void {
        this.deviceModel.OperationSystems.splice(idx, 1);
    }

    public addSoftwareSlot(): void {
        this.deviceModel.Software.push(<ISoftware> {
            IdSoftDirectory: 0
        });
    }

    public removeSoftwareSlot(idx: number): void {
        this.deviceModel.Software.splice(idx, 1);
    }

    public addHDDSlot(): void {
        this.deviceModel.HDD.push(<IHDD> {
            IdHDDDirectory: 0,
            IdRAIDDirectory: this.getNoRaidValue(),
            Count: 1
        });
    }

    private getNoRaidValue(): number {
        const noRaid = this.RaidTypes.find(x => x.Value === "нет");
        if (noRaid) {
            return Number(noRaid.Key);
        }
        return 0;
    }

    public removeHDDSlot(idx: number): void {
        this.deviceModel.HDD.splice(idx, 1);
    }

    public addNetworkAdapterSlot(): void {
        this.deviceModel.NetworkAdapters.push(<INetworkAdapter> {
            IdNetworkAdapterDirectory: 0,
        });
    }

    public removeNetworkAdapterSlot(idx: number): void {
        this.deviceModel.NetworkAdapters.splice(idx, 1);
    }

    public edit(e: Event): void {
        e.preventDefault();
        this.readonly = false;
    }

    //#region Типы устройств
    public addNewType(): void {
        this.showCreateTypeModal = true;
    }

    public get selectedType(): IDictionaryItem | undefined {
        return find(this.DeviceTypes, x => x.Key === this.model.Type);
    }

    public setSelectedType(val: string): void {
        this.model.Type = Number(val);
    }

    public onTypeSaved(value: IEquipmentDirectory): void {
        this.FetchDictionaries().then(
            () => this.model.Type = value.Id
        );
        this.closeModals();
    }
    //#endregion

    //#region Платформы
    public get selectedPlatform(): IDictionaryItem | undefined {
        return find(this.Platforms, x => x.Key === this.model.Platform);
    }

    public setSelectedPlatform(val: string): void {
        this.model.Platform = Number(val);
    }

    public addNewPlatform(): void {
        this.showCreatePlatformModal = true;
    }

    public onPlatformSaved(value: IEquipmentDirectory): void {
        this.FetchDictionaries().then(
            () => this.model.Platform = value.Id
        );
        this.closeModals();
    }

    //#endregion

    //#region Processor
    public get selectedCPU(): IDictionaryItem | undefined {
        return find(this.CPU, x => x.Key === this.deviceModel.IdCPU);
    }

    public setSelectedCPU(val: string): void {
        this.deviceModel.IdCPU = Number(val);
    }

    public addNewProcessor(): void {
        this.showCreateProcessorModal = true;
    }

    public onProcessorSaved(value: ICPUDirectory): void {
        this.FetchDictionaries().then(
            () => this.deviceModel.IdCPU = value.Id
        );
        this.closeModals();
    }
    //#endregion

    //#region Memory
    public selectedMemory(idx: number): number {
        return this.deviceModel.Memory[idx].IdRAMDirectory;
    }

    public selectedMemoryText(idx: number): string {
        const dictValue = this.Memory.find(x => x.Key === this.deviceModel.Memory[idx].IdRAMDirectory);
        if (dictValue) {
            return `${dictValue.Value} ${dictValue.Data}Gb`;
        }
        return "";
    }

    public get memoryDict(): IDictionaryItem[] {
        return this.Memory.map(x => <IDictionaryItem> { Key: x.Key, Value: `${x.Value} ${x.Data}Gb`});
    }

    public setSelectedMemory(val: string, id: string): void {
        const [, Id] = id.split("_");
        this.deviceModel.Memory[Number(Id)].IdRAMDirectory = Number(val);
    }

    public addNewMemory(idx: number): void {
        this.showCreateMemoryModal = true;
        this.createValueFor = idx;
    }

    public onMemorySaved(value: IRAMDirectory): void {
        this.deviceModel.Memory[this.createValueFor].IdRAMDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }

    //#endregion

    //#region HDD
    public selectedHDD(idx: number): number {
        return this.deviceModel.HDD[idx].IdHDDDirectory;
    }

    public selectedHDDText(idx: number): string {
        const dictValue = this.HDD.find(x => x.Key === this.deviceModel.HDD[idx].IdHDDDirectory);
        if (dictValue) {
            return `${dictValue.Value} ${dictValue.Data}Gb`;
        }
        return "";
    }

    public get hddDict(): IDictionaryItem[] {
        return this.HDD.map(x => <IDictionaryItem> { Key: x.Key, Value: `${x.Value} ${x.Data}Gb`});
    }

    public setSelectedHDD(val: string, id: string): void {
        const [, Id] = id.split("_");
        this.deviceModel.HDD[Number(Id)].IdHDDDirectory = Number(val);
    }

    public addNewHDD(idx: number): void {
        this.showCreateHDDModal = true;
        this.createValueFor = idx;
    }

    public onHDDSaved(value: IHDDDirectory): void {
        this.deviceModel.HDD[this.createValueFor].IdHDDDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }

    //#endregion

    //#region Network Adapter
    public selectedNetworkAdapter(idx: number): number {
        return this.deviceModel.NetworkAdapters[idx].IdNetworkAdapterDirectory;
    }

    public selectedNetworkAdapterText(idx: number): string {
        const dictValue = this.NetworkAdapters.find(x => x.Key === this.deviceModel.NetworkAdapters[idx].IdNetworkAdapterDirectory);
        if (dictValue) {
            return `${dictValue.Value} ${dictValue.Data} Mbps`;
        }
        return "";
    }

    public get networkAdaptersDict(): IDictionaryItem[] {
        return this.NetworkAdapters.map(x => <IDictionaryItem> { Key: x.Key, Value: `${x.Value} ${x.Data} Mbps` });
    }

    public setSelectedNetworkAdapter(val: string, id: string): void {
        const [, Id] = id.split("_");
        this.deviceModel.NetworkAdapters[Number(Id)].IdNetworkAdapterDirectory = Number(val);
    }

    public addNewNetworkAdapter(idx: number): void {
        this.showCreateNetworkAdapterModal = true;
        this.createValueFor = idx;
    }

    public onNetworkAdapterSaved(value: INetworkAdapterDirectory): void {
        this.deviceModel.NetworkAdapters[this.createValueFor].IdNetworkAdapterDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }

    //#endregion

    //#region Software
    public selectedSoftware(idx: number): number {
        return this.deviceModel.Software[idx].IdSoftDirectory;
    }

    public selectedSoftwareText(idx: number): string {
        const dictValue = this.Software.find(x => x.Key === this.deviceModel.Software[idx].IdSoftDirectory);
        if (dictValue) {
            return dictValue.Value;
        }
        return "";
    }

    public setSelectedSoftware(val: string, id: string): void {
        const [, Id] = id.split("_");
        this.deviceModel.Software[Number(Id)].IdSoftDirectory = Number(val);
    }

    public addNewSoftware(idx: number): void {
        this.showCreateSoftwareModal = true;
        this.createValueFor = idx;
    }

    public onSoftwareSaved(value: ISoftware): void {
        this.deviceModel.Software[this.createValueFor].IdSoftDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }
    //#endregion

    //#region OS
    public selectedOS(idx: number): number {
        return this.deviceModel.OperationSystems[idx].IdOSDirectory;
    }

    public selectedOSText(idx: number): string {
        const dictValue = this.OS.find(x => x.Key === this.deviceModel.OperationSystems[idx].IdOSDirectory);
        if (dictValue) {
            return dictValue.Value;
        }
        return "";
    }

    public setSelectedOS(val: string, id: string): void {
        const [, Id] = id.split("_");
        this.deviceModel.OperationSystems[Number(Id)].IdOSDirectory = Number(val);
    }

    public addNewOS(idx: number): void {
        this.showCreateOSModal = true;
        this.createValueFor = idx;
    }

    public onOSSaved(value: ISoftware): void {
        this.deviceModel.OperationSystems[this.createValueFor].IdOSDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }
    //#endregion

    public closeModals(): void {
        this.showCreateTypeModal = false;
        this.showCreatePlatformModal = false;
        this.showCreateProcessorModal = false;
        this.showCreateMemoryModal = false;
        this.showCreateHDDModal = false;
        this.showCreateNetworkAdapterModal = false;
        this.showCreateSoftwareModal = false;
        this.showCreateOSModal = false;
    }

    public formatDate(date: Date): string | null {
        if (this.deviceModel.AWZDate) {
            return _formatDate(date);
        }
        return null;
    }

    public getDictionaryValue(dictionary: IDictionaryItem[], key: number): string | null {
        const result = dictionary.find(x => x.Key == key);
        if (result) {
            return result.Value;
        }
        return null;
    }

    public async remove() {
        if (this.model.Id) {
            await this.RemoveEquipment(this.model.Id);
            this.$emit("removed");
        }
    }
}
