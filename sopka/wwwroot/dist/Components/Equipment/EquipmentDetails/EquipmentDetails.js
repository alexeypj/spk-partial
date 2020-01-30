var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Mutation, Getter, Action } from "vuex-class";
import { Mutations, namespace, Getters, Actions } from "../../../Store/Modules/Inventory/constants";
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
import { formatDate as _formatDate } from "../../../Shared/utils";
import select2 from "../../../Shared/Select2/select2.vue";
let EquipmentDetails = class EquipmentDetails extends Vue {
    constructor() {
        super(...arguments);
        this.readonly = false;
        this.model = {
            Platform: 0,
            Type: 0
        };
        this.deviceModel = {
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
        this.isSaved = false;
        this.errorText = "";
        //#region Modals
        this.showCreateTypeModal = false;
        this.showCreatePlatformModal = false;
        this.showCreateProcessorModal = false;
        this.showCreateMemoryModal = false;
        /** Номер в массиве объектов, для которого создается новый элемент */
        this.createValueFor = 0;
        this.showCreateHDDModal = false;
        this.showCreateNetworkAdapterModal = false;
        this.showCreateSoftwareModal = false;
        this.showCreateOSModal = false;
    }
    //#endregion
    mounted() {
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
    getEquipment() {
        const equipmentId = Number(this.Id) || 0;
        if (equipmentId !== 0) {
            this.FetchEquipment(equipmentId)
                .then((result) => {
                this.model = result;
                this.deviceModel = result.Devices[0];
                if (this.deviceModel.AWZDate) {
                    const m = moment(this.deviceModel.AWZDate);
                    this.deviceModel.AWZDate = m.format("YYYY-MM-DD HH:mm");
                }
            });
            return true;
        }
        return false;
    }
    beforeDestroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
    store(e) {
        e.preventDefault();
        this.$validator.validateAll().then((valid) => {
            if (valid) {
                this.errorText = "";
                this.model.Devices = [this.deviceModel];
                this.StoreEquipment(this.model)
                    .then((result) => {
                    const objResult = result;
                    if (objResult.Id) {
                        this.isSaved = true;
                        this.model = objResult;
                        this.deviceModel = this.model.Devices[0];
                        if (this.deviceModel.AWZDate) {
                            const m = moment(this.deviceModel.AWZDate);
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
    cancel(e) {
        e.preventDefault();
        if (this.readonly || this.Id === 0) {
            this.$emit("cancelEdit", this.readonly);
        }
        else {
            this.getEquipment();
            this.readonly = true;
        }
    }
    addProcessorSlot() {
        this.deviceModel.IdCPU = 0;
        this.deviceModel.CPUCount = 1;
    }
    clearProcessor() {
        this.deviceModel.IdCPU = undefined;
        this.deviceModel.CPUCount = undefined;
    }
    get memoryValues() {
        const result = [];
        const includesValues = [];
        map(this.Memory, (x) => {
            if (includesValues.indexOf(x.Value) === -1) {
                result.push(x);
                includesValues.push(x.Value);
            }
        });
        return result;
    }
    addMemorySlot() {
        this.deviceModel.Memory.push({
            IdRAMDirectory: 0,
            Count: 1
        });
    }
    removeMemorySlot(idx) {
        this.deviceModel.Memory.splice(idx, 1);
    }
    addOSSlot() {
        this.deviceModel.OperationSystems.push({
            IdOSDirectory: 0
        });
    }
    removeOSSlot(idx) {
        this.deviceModel.OperationSystems.splice(idx, 1);
    }
    addSoftwareSlot() {
        this.deviceModel.Software.push({
            IdSoftDirectory: 0
        });
    }
    removeSoftwareSlot(idx) {
        this.deviceModel.Software.splice(idx, 1);
    }
    addHDDSlot() {
        this.deviceModel.HDD.push({
            IdHDDDirectory: 0,
            IdRAIDDirectory: this.getNoRaidValue(),
            Count: 1
        });
    }
    getNoRaidValue() {
        const noRaid = this.RaidTypes.find(x => x.Value === "нет");
        if (noRaid) {
            return Number(noRaid.Key);
        }
        return 0;
    }
    removeHDDSlot(idx) {
        this.deviceModel.HDD.splice(idx, 1);
    }
    addNetworkAdapterSlot() {
        this.deviceModel.NetworkAdapters.push({
            IdNetworkAdapterDirectory: 0,
        });
    }
    removeNetworkAdapterSlot(idx) {
        this.deviceModel.NetworkAdapters.splice(idx, 1);
    }
    edit(e) {
        e.preventDefault();
        this.readonly = false;
    }
    //#region Типы устройств
    addNewType() {
        this.showCreateTypeModal = true;
    }
    get selectedType() {
        return find(this.DeviceTypes, x => x.Key === this.model.Type);
    }
    setSelectedType(val) {
        this.model.Type = Number(val);
    }
    onTypeSaved(value) {
        this.FetchDictionaries().then(() => this.model.Type = value.Id);
        this.closeModals();
    }
    //#endregion
    //#region Платформы
    get selectedPlatform() {
        return find(this.Platforms, x => x.Key === this.model.Platform);
    }
    setSelectedPlatform(val) {
        this.model.Platform = Number(val);
    }
    addNewPlatform() {
        this.showCreatePlatformModal = true;
    }
    onPlatformSaved(value) {
        this.FetchDictionaries().then(() => this.model.Platform = value.Id);
        this.closeModals();
    }
    //#endregion
    //#region Processor
    get selectedCPU() {
        return find(this.CPU, x => x.Key === this.deviceModel.IdCPU);
    }
    setSelectedCPU(val) {
        this.deviceModel.IdCPU = Number(val);
    }
    addNewProcessor() {
        this.showCreateProcessorModal = true;
    }
    onProcessorSaved(value) {
        this.FetchDictionaries().then(() => this.deviceModel.IdCPU = value.Id);
        this.closeModals();
    }
    //#endregion
    //#region Memory
    selectedMemory(idx) {
        return this.deviceModel.Memory[idx].IdRAMDirectory;
    }
    selectedMemoryText(idx) {
        const dictValue = this.Memory.find(x => x.Key === this.deviceModel.Memory[idx].IdRAMDirectory);
        if (dictValue) {
            return `${dictValue.Value} ${dictValue.Data}Gb`;
        }
        return "";
    }
    get memoryDict() {
        return this.Memory.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data}Gb` }));
    }
    setSelectedMemory(val, id) {
        const [, Id] = id.split("_");
        this.deviceModel.Memory[Number(Id)].IdRAMDirectory = Number(val);
    }
    addNewMemory(idx) {
        this.showCreateMemoryModal = true;
        this.createValueFor = idx;
    }
    onMemorySaved(value) {
        this.deviceModel.Memory[this.createValueFor].IdRAMDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }
    //#endregion
    //#region HDD
    selectedHDD(idx) {
        return this.deviceModel.HDD[idx].IdHDDDirectory;
    }
    selectedHDDText(idx) {
        const dictValue = this.HDD.find(x => x.Key === this.deviceModel.HDD[idx].IdHDDDirectory);
        if (dictValue) {
            return `${dictValue.Value} ${dictValue.Data}Gb`;
        }
        return "";
    }
    get hddDict() {
        return this.HDD.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data}Gb` }));
    }
    setSelectedHDD(val, id) {
        const [, Id] = id.split("_");
        this.deviceModel.HDD[Number(Id)].IdHDDDirectory = Number(val);
    }
    addNewHDD(idx) {
        this.showCreateHDDModal = true;
        this.createValueFor = idx;
    }
    onHDDSaved(value) {
        this.deviceModel.HDD[this.createValueFor].IdHDDDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }
    //#endregion
    //#region Network Adapter
    selectedNetworkAdapter(idx) {
        return this.deviceModel.NetworkAdapters[idx].IdNetworkAdapterDirectory;
    }
    selectedNetworkAdapterText(idx) {
        const dictValue = this.NetworkAdapters.find(x => x.Key === this.deviceModel.NetworkAdapters[idx].IdNetworkAdapterDirectory);
        if (dictValue) {
            return `${dictValue.Value} ${dictValue.Data} Mbps`;
        }
        return "";
    }
    get networkAdaptersDict() {
        return this.NetworkAdapters.map(x => ({ Key: x.Key, Value: `${x.Value} ${x.Data} Mbps` }));
    }
    setSelectedNetworkAdapter(val, id) {
        const [, Id] = id.split("_");
        this.deviceModel.NetworkAdapters[Number(Id)].IdNetworkAdapterDirectory = Number(val);
    }
    addNewNetworkAdapter(idx) {
        this.showCreateNetworkAdapterModal = true;
        this.createValueFor = idx;
    }
    onNetworkAdapterSaved(value) {
        this.deviceModel.NetworkAdapters[this.createValueFor].IdNetworkAdapterDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }
    //#endregion
    //#region Software
    selectedSoftware(idx) {
        return this.deviceModel.Software[idx].IdSoftDirectory;
    }
    selectedSoftwareText(idx) {
        const dictValue = this.Software.find(x => x.Key === this.deviceModel.Software[idx].IdSoftDirectory);
        if (dictValue) {
            return dictValue.Value;
        }
        return "";
    }
    setSelectedSoftware(val, id) {
        const [, Id] = id.split("_");
        this.deviceModel.Software[Number(Id)].IdSoftDirectory = Number(val);
    }
    addNewSoftware(idx) {
        this.showCreateSoftwareModal = true;
        this.createValueFor = idx;
    }
    onSoftwareSaved(value) {
        this.deviceModel.Software[this.createValueFor].IdSoftDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }
    //#endregion
    //#region OS
    selectedOS(idx) {
        return this.deviceModel.OperationSystems[idx].IdOSDirectory;
    }
    selectedOSText(idx) {
        const dictValue = this.OS.find(x => x.Key === this.deviceModel.OperationSystems[idx].IdOSDirectory);
        if (dictValue) {
            return dictValue.Value;
        }
        return "";
    }
    setSelectedOS(val, id) {
        const [, Id] = id.split("_");
        this.deviceModel.OperationSystems[Number(Id)].IdOSDirectory = Number(val);
    }
    addNewOS(idx) {
        this.showCreateOSModal = true;
        this.createValueFor = idx;
    }
    onOSSaved(value) {
        this.deviceModel.OperationSystems[this.createValueFor].IdOSDirectory = value.Id;
        this.FetchDictionaries();
        this.closeModals();
    }
    //#endregion
    closeModals() {
        this.showCreateTypeModal = false;
        this.showCreatePlatformModal = false;
        this.showCreateProcessorModal = false;
        this.showCreateMemoryModal = false;
        this.showCreateHDDModal = false;
        this.showCreateNetworkAdapterModal = false;
        this.showCreateSoftwareModal = false;
        this.showCreateOSModal = false;
    }
    formatDate(date) {
        if (this.deviceModel.AWZDate) {
            return _formatDate(date);
        }
        return null;
    }
    getDictionaryValue(dictionary, key) {
        const result = dictionary.find(x => x.Key === key);
        if (result) {
            return result.Value;
        }
        return null;
    }
};
__decorate([
    Prop()
], EquipmentDetails.prototype, "Id", void 0);
__decorate([
    Prop({ default: 0 })
], EquipmentDetails.prototype, "ObjectId", void 0);
__decorate([
    Prop({ default: false })
], EquipmentDetails.prototype, "Readonly", void 0);
__decorate([
    Mutation(Mutations.SET_DEVICE, { namespace })
], EquipmentDetails.prototype, "SetDevice", void 0);
__decorate([
    Action(Actions.FETCH_DEVICE_DICTIONARIES, { namespace })
], EquipmentDetails.prototype, "FetchDictionaries", void 0);
__decorate([
    Action(Actions.STORE_EQUIPMENT, { namespace })
], EquipmentDetails.prototype, "StoreEquipment", void 0);
__decorate([
    Action(Actions.FETCH_EQUIPMENT, { namespace })
], EquipmentDetails.prototype, "FetchEquipment", void 0);
__decorate([
    Getter(Getters.EQUIPMENT, { namespace })
], EquipmentDetails.prototype, "Equipment", void 0);
__decorate([
    Getter(Getters.DICTIONARY_DEVICE_TYPES, { namespace })
], EquipmentDetails.prototype, "DeviceTypes", void 0);
__decorate([
    Getter(Getters.DICTIONARY_PLATFORMS, { namespace })
], EquipmentDetails.prototype, "Platforms", void 0);
__decorate([
    Getter(Getters.DICTIONARY_OBJECTS, { namespace })
], EquipmentDetails.prototype, "Objects", void 0);
__decorate([
    Getter(Getters.DICTIONARY_RAID_TYPES, { namespace })
], EquipmentDetails.prototype, "RaidTypes", void 0);
__decorate([
    Getter(Getters.DICTIONARY_CPU, { namespace })
], EquipmentDetails.prototype, "CPU", void 0);
__decorate([
    Getter(Getters.DICTIONARY_MEMORY, { namespace })
], EquipmentDetails.prototype, "Memory", void 0);
__decorate([
    Getter(Getters.DICTIONARY_OS, { namespace })
], EquipmentDetails.prototype, "OS", void 0);
__decorate([
    Getter(Getters.DICTIONARY_SOFTWARE, { namespace })
], EquipmentDetails.prototype, "Software", void 0);
__decorate([
    Getter(Getters.DICTIONARY_HDD, { namespace })
], EquipmentDetails.prototype, "HDD", void 0);
__decorate([
    Getter(Getters.DICTIONARY_NETWORK_ADAPTERS, { namespace })
], EquipmentDetails.prototype, "NetworkAdapters", void 0);
EquipmentDetails = __decorate([
    Component({
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
], EquipmentDetails);
export default EquipmentDetails;
//# sourceMappingURL=EquipmentDetails.js.map