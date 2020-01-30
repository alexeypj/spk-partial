import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/Dictionaries/constants";
import { IDictionaries, IDictionaryType } from "../../Store/Modules/Dictionaries/types";
import ObjectTypes from "./ObjectTypes/index.vue"
import Branches from "./Branches/index.vue"
import EquipmentTypes from "./EquipmentTypes/index.vue"
import AttackTypes from "./AttackTypes/index.vue"
import Raid from "./Raid/index.vue"
import OS from "./OS/index.vue"
import Software from "./Software/index.vue"
import Platforms from "./Platforms/index.vue"
import CPU from "./CPU/index.vue"
import HDD from "./HDD/index.vue"
import RAM from "./RAM/index.vue"
import NetworkAdapter from "./NetworkAdapters/index.vue"
import SeveritySynonyms from "./SeveritySynonyms/index.vue"
import { logAction } from "../../Shared/utils";
import { LogActions } from "../../Shared/LogActions";

import VeeValidate, { Validator, Configuration } from "vee-validate";
import RuLocalization  from "vee-validate/dist/locale/ru.js";

Validator.localize("ru", RuLocalization);
const validatorConfig: Object = { locale: "ru", fieldsBagName: "formFields"};
Vue.use<Configuration>(VeeValidate, validatorConfig);

@Component({
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
        SeveritySynonyms
    }
})
export default class Directories extends Vue {

    @State(namespace)
    public readonly State: IDictionaries;

    private SelectedDic: IDictionaryType | null;
    private SearchString: string = "";
    private dics: IDictionaryType[] = [];

    mounted() {

    }

    created(): void {
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
            { Title: "Уровень критичности", Component: SeveritySynonyms, IsSelected: false, LogAction: LogActions.DirectorySeveritySynonymsIndex },
        ];
        this.select(this.State.Dictionaries[0]);
        this.dics = [...this.State.Dictionaries];
    }

    select(dic: IDictionaryType): void {
        for (let dictionary of this.State.Dictionaries) {
            if (dic === dictionary) {
                dictionary.IsSelected = true;
            } else {
                dictionary.IsSelected = false;
            }
        }
        this.SelectedDic = dic;
        logAction(dic.LogAction);
    }

    @Watch('SearchString')
    onSearchStringChanged(val: string, oldVal: string) {
        this.find();
    }

    find() {
        if (!this.SearchString) {
            this.dics = [...this.State.Dictionaries];
        } else {
            this.dics = this.State.Dictionaries.filter(
                x => x.Title.toLowerCase().indexOf(this.SearchString.toLowerCase()) >= 0);
        }
    }
}