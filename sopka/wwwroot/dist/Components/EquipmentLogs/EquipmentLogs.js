var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { Getters, namespace, Actions, Mutations } from "../../Store/Modules/EquipmentLogs/constants";
import { createRule, createFilter } from "../../Store/Modules/EquipmentLogs/types";
import Rule from "./Rule/Rule.vue";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { Actions as dictActions, Getters as dictGetters, namespace as dictNamespace } from "../../Store/Modules/Dictionaries/constants";
/** Правила обработки журналов оборудования */
let EquipmentLogs = class EquipmentLogs extends Vue {
    /** Правила обработки журналов оборудования */
    constructor() {
        super(...arguments);
        this.showForm = false;
        this.model = null;
        this.readonly = false;
        this.filter = createFilter();
        this.isFilters = true;
        this.rules = [];
        this.columns = [
            { Name: "Id", DisplayName: "№" },
            { Name: "Name", DisplayName: "Название" },
            { Name: "Text", DisplayName: "Правило" },
            { Name: "IsActiveText", DisplayName: "Активно" },
        ];
        this.actionValue = "";
    }
    onIdChange(newVal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newVal) {
                this.showForm = true;
                // if (newVal !== 0) {
                // }
            }
            else {
                this.showForm = false;
                this.model = null;
            }
        });
    }
    created() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.SeverityDictionary.length === 0) {
                yield Promise.all([this.FetchSeverity(), this.FetchEquipmentType()]);
            }
            this.rules = yield this.FetchRulesList(this.Filter);
            this.rules.forEach(rule => {
                rule.IsActiveText = this.createActivityText(rule.IsActive);
                rule.Text = this.FormatRule(rule, this.EquipmentDictionary, this.SeverityDictionary);
            });
        });
    }
    mounted() {
        this.filter = Object.assign({}, this.Filter);
        if (this.Id) {
            if (Number(this.Id) === 0) {
                this.create();
                this.showForm = true;
            }
            else {
                this.open(Number(this.Id));
            }
        }
    }
    create() {
        this.model = createRule();
        this.$router.push({ path: "/EquipmentLogs/0" });
    }
    open(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.model = yield this.FetchRule(id);
            this.$router.push({ path: "/EquipmentLogs/" + id });
            this.showForm = true;
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = this.rules.find(x => x.Id === id);
            if (rule) {
                const idx = this.rules.indexOf(rule);
                bootbox.confirm({
                    message: `Вы точно хотите удалить правило "${rule.Name}"?`,
                    animate: false,
                    buttons: {
                        confirm: {
                            label: "Да",
                            className: "btn-success"
                        },
                        cancel: {
                            label: "Отмена",
                            className: "btn-white"
                        },
                    },
                    callback: (result) => {
                        if (result) {
                            this.RemoveRule(id).then((r) => {
                                if (r > 0) {
                                    this.rules.splice(idx, 1);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    close() {
        this.$router.push({ path: "/EquipmentLogs" });
    }
    cancel() {
        this.$router.back();
        // this.readonly = true;
    }
    edit() {
        this.readonly = false;
    }
    applyFilter(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            this.SetFilter(filter);
            this.rules = yield this.FetchRulesList(this.Filter);
            this.rules.forEach(rule => {
                rule.IsActiveText = this.createActivityText(rule.IsActive);
                rule.Text = this.FormatRule(rule, this.EquipmentDictionary, this.SeverityDictionary);
            });
        });
    }
    resetFilter() {
        this.applyFilter(createFilter());
    }
    selectorChange(value, rule) {
        switch (value) {
            case "disable":
                {
                    if (rule) {
                        this.switchRule(rule.Id, !rule.IsActive);
                    }
                }
                break;
            case "edit":
                this.open(rule.Id);
                break;
            case "remove":
                this.remove(rule.Id);
                break;
        }
        this.actionValue = "";
    }
    switchRule(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = this.rules.find(x => x.Id === id);
            if (rule) {
                const idx = this.rules.indexOf(rule);
                rule.IsActiveText = `<i class="fa fa-spinner fa-spin fa-fw"></i>`;
                const result = yield this.ChangeActivity({ id, value });
                rule.IsActive = result;
                rule.IsActiveText = this.createActivityText(result);
                const rules = [...this.rules];
                rules[idx] = rule;
                this.rules = rules;
            }
        });
    }
    createActivityText(value) {
        return value ?
            `<i class="fa fa-check" style="color:green"></i>` :
            `<i class="fa fa-times" style="color:red"></i>`;
    }
    getActions(rule) {
        return [
            { Key: "", Value: "Действия" },
            { Key: "edit", Value: "Редактировать" },
            { Key: "remove", Value: "Удалить" },
            { Key: "disable", Value: "Включить/выключить" }
        ];
    }
    showRules() {
        this.isFilters = false;
    }
    showFilters() {
        this.isFilters = true;
    }
    onStore() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rules = yield this.FetchRulesList(this.Filter);
            this.rules.forEach(rule => {
                rule.IsActiveText = this.createActivityText(rule.IsActive);
                rule.Text = this.FormatRule(rule, this.EquipmentDictionary, this.SeverityDictionary);
            });
        });
    }
};
__decorate([
    Prop()
], EquipmentLogs.prototype, "Id", void 0);
__decorate([
    Action(Actions.FETCH_RULES_LIST, { namespace })
], EquipmentLogs.prototype, "FetchRulesList", void 0);
__decorate([
    Action(dictActions.FETCH_EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace })
], EquipmentLogs.prototype, "FetchSeverity", void 0);
__decorate([
    Action(dictActions.FETCH_EQUIPMENT_TYPE_DIRECTORY, { namespace: dictNamespace })
], EquipmentLogs.prototype, "FetchEquipmentType", void 0);
__decorate([
    Action(Actions.CHANGE_ACTIVITY, { namespace })
], EquipmentLogs.prototype, "ChangeActivity", void 0);
__decorate([
    Action(Actions.FETCH_RULE, { namespace })
], EquipmentLogs.prototype, "FetchRule", void 0);
__decorate([
    Action(Actions.REMOVE_RULE, { namespace })
], EquipmentLogs.prototype, "RemoveRule", void 0);
__decorate([
    Getter(Getters.CURRENT_FILTER, { namespace })
], EquipmentLogs.prototype, "Filter", void 0);
__decorate([
    Getter(Getters.RULES_LIST_TOTAL, { namespace })
], EquipmentLogs.prototype, "RulesCount", void 0);
__decorate([
    Getter(Getters.FORMAT_RULE, { namespace })
], EquipmentLogs.prototype, "FormatRule", void 0);
__decorate([
    Mutation(Mutations.SET_FILTER, { namespace })
], EquipmentLogs.prototype, "SetFilter", void 0);
__decorate([
    Getter(dictGetters.EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace })
], EquipmentLogs.prototype, "SeverityDictionary", void 0);
__decorate([
    Getter(dictGetters.EQUIPMENT_TYPES_DICTIONARY, { namespace: dictNamespace })
], EquipmentLogs.prototype, "EquipmentDictionary", void 0);
__decorate([
    Watch("Id")
], EquipmentLogs.prototype, "onIdChange", null);
EquipmentLogs = __decorate([
    Component({
        components: {
            Rule,
            Datatable,
            select2
        }
    })
], EquipmentLogs);
export default EquipmentLogs;
//# sourceMappingURL=EquipmentLogs.js.map