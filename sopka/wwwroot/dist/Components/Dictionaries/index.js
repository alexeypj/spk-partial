var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { State, } from "vuex-class";
import { namespace } from "../../Store/Modules/Dictionaries/constants";
import ObjectTypes from "./ObjectTypes/index.vue";
import Branches from "./Branches/index.vue";
import EquipmentTypes from "./EquipmentTypes/index.vue";
import AttackTypes from "./AttackTypes/index.vue";
import Raid from "./Raid/index.vue";
import OS from "./OS/index.vue";
import Software from "./Software/index.vue";
import Platforms from "./Platforms/index.vue";
import CPU from "./CPU/index.vue";
import HDD from "./HDD/index.vue";
import RAM from "./RAM/index.vue";
import NetworkAdapter from "./NetworkAdapters/index.vue";
import { logAction } from "../../Shared/utils";
import { LogActions } from "../../Shared/LogActions";
import VeeValidate, { Validator } from "vee-validate";
import RuLocalization from "vee-validate/dist/locale/ru.js";
Validator.localize("ru", RuLocalization);
const validatorConfig = { locale: "ru", fieldsBagName: "formFields" };
Vue.use(VeeValidate, validatorConfig);
let Directories = class Directories extends Vue {
    constructor() {
        super(...arguments);
        this.SearchString = "";
        this.dics = [];
    }
    mounted() {
    }
    created() {
        this.State.Dictionaries = [
            { Title: "Тип oбъекта", Component: ObjectTypes, IsSelected: false, LogAction: LogActions.DirectoryObjectTypesIndex },
            { Title: "Филиал", Component: Branches, IsSelected: false, LogAction: LogActions.DirectoryBranchesIndex },
            { Title: "Аппаратная платформа (модель устройства)", Component: Platforms, IsSelected: false, LogAction: LogActions.DirectoryPlatformsIndex },
            { Title: "ПО", Component: Software, IsSelected: false, LogAction: LogActions.DirectorySoftwareIndex },
            { Title: "ОС", Component: OS, IsSelected: false, LogAction: LogActions.DirectoryOSIndex },
            { Title: "Процессор", Component: CPU, IsSelected: false, LogAction: LogActions.DirectoryCPUIndex },
            { Title: "Тип оборудования", Component: EquipmentTypes, IsSelected: false, LogAction: LogActions.DirectoryEquipmentTypesIndex },
            { Title: "Тип атаки", Component: AttackTypes, IsSelected: false, LogAction: LogActions.DirectoryAttackTypesIndex },
            { Title: "Диски", Component: HDD, IsSelected: false, LogAction: LogActions.DirectoryHDDIndex },
            { Title: "Память", Component: RAM, IsSelected: false, LogAction: LogActions.DirectoryRAMIndex },
            { Title: "Сетевой адаптер", Component: NetworkAdapter, IsSelected: false, LogAction: LogActions.DirectoryNetworkAdaptersIndex },
        ];
        this.select(this.State.Dictionaries[0]);
        this.dics = [...this.State.Dictionaries];
    }
    select(dic) {
        for (let dictionary of this.State.Dictionaries) {
            if (dic === dictionary) {
                dictionary.IsSelected = true;
            }
            else {
                dictionary.IsSelected = false;
            }
        }
        this.SelectedDic = dic;
        logAction(dic.LogAction);
    }
    onSearchStringChanged(val, oldVal) {
        this.find();
    }
    find() {
        if (!this.SearchString) {
            this.dics = [...this.State.Dictionaries];
        }
        else {
            this.dics = this.State.Dictionaries.filter(x => x.Title.toLowerCase().indexOf(this.SearchString.toLowerCase()) >= 0);
        }
    }
};
__decorate([
    State(namespace)
], Directories.prototype, "State", void 0);
__decorate([
    Watch('SearchString')
], Directories.prototype, "onSearchStringChanged", null);
Directories = __decorate([
    Component({
        components: {
            ObjectTypes,
            Branches,
            EquipmentTypes,
            AttackTypes,
            Raid,
            OS,
            Software,
            Platforms,
            CPU,
            HDD,
            RAM,
            NetworkAdapter,
        }
    })
], Directories);
export default Directories;
//# sourceMappingURL=index.js.map