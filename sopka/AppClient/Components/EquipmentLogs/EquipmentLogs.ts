import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { Getters, namespace, Actions, Mutations } from "../../Store/Modules/EquipmentLogs/constants";
import { IEquipmentLogsFilter, IRule, createRule, IRuleFormatted, createFilter } from "../../Store/Modules/EquipmentLogs/types";
import Rule from "./Rule/Rule.vue";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import { IColumnOptions } from "../../Shared/Datatable/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";
import select2 from "../../Shared/Select2/select2.vue";
import {
    Actions as dictActions,
    Getters as dictGetters,
    namespace as dictNamespace
} from "../../Store/Modules/Dictionaries/constants";
import { Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import { logAction, removeConfirmation } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
import EquipmentLogsRuleIndex = LogActions.EquipmentLogsRuleIndex;

/** Правила обработки журналов оборудования */
@Component({
    components: {
        Rule,
        Datatable,
        select2
    }
})
export default class EquipmentLogs extends Vue {

    @Prop()
    public readonly Id: string | undefined;

    @Action(Actions.FETCH_RULES_LIST, { namespace })
    public FetchRulesList: (filter: IEquipmentLogsFilter) => Promise<IRule[]>;

    @Action(dictActions.FETCH_EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace })
    public FetchSeverity: () => Promise<IDictionaryItem[]>;

    @Action(dictActions.FETCH_EQUIPMENT_TYPE_DIRECTORY, { namespace: dictNamespace })
    public FetchEquipmentType: () => Promise<IDictionaryItem[]>;

    @Action(Actions.CHANGE_ACTIVITY, { namespace })
    public ChangeActivity: ({ id, value}: {id: number, value: boolean}) => Promise<boolean>;

    @Action(Actions.FETCH_RULE, { namespace })
    public FetchRule: (id: number) => Promise<IRule>;

    @Action(Actions.REMOVE_RULE, { namespace })
    public RemoveRule: (id: number) => Promise<number>;

    @Getter(Getters.CURRENT_FILTER, { namespace })
    public Filter: IEquipmentLogsFilter;

    @Getter(Getters.RULES_LIST_TOTAL, { namespace })
    public readonly RulesCount: number;

    @Getter(Getters.FORMAT_RULE, { namespace})
    public FormatRule: (rule: IRule, equipments: IDictionaryItem[], criticality: IDictionaryItem[]) => string;

    @Mutation(Mutations.SET_FILTER, { namespace })
    public SetFilter: (filter: IEquipmentLogsFilter) => void;

    @Getter(dictGetters.EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace})
    public readonly SeverityDictionary: IDictionaryItem[];

    @Getter(dictGetters.EQUIPMENT_TYPES_DICTIONARY, { namespace: dictNamespace })
    public readonly EquipmentDictionary: IDictionaryItem[];

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Getter(Getters.IS_RULE_SAVING, { namespace})
    public readonly IsSaving: boolean;

    @Watch("Id")
    public async onIdChange(newVal: number|undefined): Promise<void> {
        if (newVal) {
            this.showForm = true;
            if (newVal > 0) {
            }
             //if (newVal !== 0) {

             //}
        } else {
            logAction(LogActions.EquipmentLogsRuleIndex);
            this.showForm = false;
            this.model = null;
        }
    }

    private showForm: boolean = false;
    private model: IRule|null = null;
    private readonly = false;
    private filter: IEquipmentLogsFilter = createFilter();
    private isFilters: boolean = true;

    private rules: IRuleFormatted[] = [];

    public async created() {
        if (this.SeverityDictionary.length === 0) {
            await Promise.all([this.FetchSeverity(), this.FetchEquipmentType()]);
        }

        this.rules = await this.FetchRulesList(this.Filter);
        this.rules.forEach(rule => {
            rule.IsActiveText = this.createActivityText(rule.IsActive);
            rule.Text = this.FormatRule(rule, this.EquipmentDictionary, this.SeverityDictionary);
        });

    }

    public mounted() {
        this.filter = { ...this.Filter };
        if (this.Id) {
            if (Number(this.Id) === 0) {
                this.create();
                this.showForm = true;
            } else {
                this.open(Number(this.Id));
            }
        } else {
            logAction(LogActions.EquipmentLogsRuleIndex);
        }
    }

    public create(): void {
        this.model = createRule();
        this.$router.push({ path: "/EquipmentLogs/0" });
    }

    public async open(id: number) {
        this.model = await this.FetchRule(id);
        this.$router.push({ path: "/EquipmentLogs/" + id });
        this.showForm = true;
        logAction(LogActions.EquipmentLogsRuleItem, EntityType.EquipmentLog, this.model.Id.toString(), null, this.model.Name);
    }

    public async remove(id: number) {
        const rule = this.rules.find(x => x.Id === id);
        if (rule) {
            const idx = this.rules.indexOf(rule);

            removeConfirmation(
                `Вы уверены, что хотите удалить <strong>${rule.Name}</strong>?`,
                () => {
                    this.RemoveRule(id).then((r: number) => {
                        if (r > 0) {
                            this.rules.splice(idx, 1);
                        }
                    });
                }
            );
        }
    }

    public close(): void {
        this.$router.push({ path: "/EquipmentLogs" });
    }

    public cancel(): void {
        this.$router.back();
        // this.readonly = true;
    }

    public edit(): void {
        this.readonly = false;
    }

    public async applyFilter(filter: IEquipmentLogsFilter) {
        this.SetFilter(filter);
        this.filter = filter;

        this.rules = await this.FetchRulesList(filter);
        this.rules.forEach(rule => {
            rule.IsActiveText = this.createActivityText(rule.IsActive);
            rule.Text = this.FormatRule(rule, this.EquipmentDictionary, this.SeverityDictionary);
        });
    }

    public resetFilter(): void {
        this.applyFilter(createFilter());
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Name", DisplayName: "Название", Sort: true, SortColumnName: "Name" },
        { Name: "Text", DisplayName: "Правило" },
        { Name: "IsActiveText", DisplayName: "Активно", Sort: true, SortColumnName: "IsActive"},
    ];

    public selectorChange(value: any, rule: IRule): void {
        switch (value) {
            case "disable": {
                if (rule) {
                    this.switchRule(rule.Id, !rule.IsActive);
                }
            }               break;
            case "edit": this.open(rule.Id); break;
            case "remove": this.remove(rule.Id); break;
        }
        this.actionValue = "";
    }

    public async switchRule(id: number, value: boolean) {
        const rule = this.rules.find(x => x.Id === id);

        if (rule) {
            const idx = this.rules.indexOf(rule);

            rule.IsActiveText = `<i class="fa fa-spinner fa-spin fa-fw"></i>`;
            const result = await this.ChangeActivity({ id, value});
            rule.IsActive = result;
            rule.IsActiveText = this.createActivityText(result);

            const rules = [... this.rules];
            rules[idx] = rule;
            this.rules = rules;
        }
    }

    private createActivityText(value: boolean): string {
        return value ?
        `<i class="fa fa-check" style="color:green"></i>` :
        `<i class="fa fa-times" style="color:red"></i>` ;
    }

    private actionValue: string = "";

    private getActions(rule: IRule): IDictionaryItem[] {
        return [
            { Key: "", Value: "Действия" },
            { Key: "edit", Value: "Редактировать" },
            { Key: "remove", Value: "Удалить" },
            { Key: "disable", Value: "Включить/выключить"}
        ];
    }

    private showRules(): void {
        this.isFilters = false;
    }

    private showFilters(): void {
        this.isFilters = true;
    }

    private async onStore() {
        this.rules = await this.FetchRulesList(this.Filter);
        this.rules.forEach(rule => {
            rule.IsActiveText = this.createActivityText(rule.IsActive);
            rule.Text = this.FormatRule(rule, this.EquipmentDictionary, this.SeverityDictionary);
        });
    }
}
