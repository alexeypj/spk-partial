import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IRule, createCondition, createRule, ICondition } from "../../../Store/Modules/EquipmentLogs/types";
import { Getter, Action } from "vuex-class";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import { Actions, Getters, namespace } from "../../../Store/Modules/EquipmentLogs/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import {
    Actions as dictActions,
    Getters as dictGetters,
    namespace as dictNamespace
} from "../../../Store/Modules/Dictionaries/constants";
import { FieldError } from "vee-validate/types/vee-validate";
import { orderBy } from "lodash";

@Component({
    components: {
        select2
    }
})
export default class Rule extends Vue {

    @Prop({ required: true })
    public readonly Model: IRule;

    @Getter(Getters.ON_CONDITION_DICTIONARY, { namespace })
    public readonly OnConditionsDictionary: IDictionaryItem[];

    @Getter(Getters.ACTION_DICTIONARY, { namespace })
    public readonly ActionDictionary: IDictionaryItem[];

    @Action(dictActions.FETCH_EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace })
    public FetchSeverity: () => Promise<IDictionaryItem[]>;

    @Action(dictActions.FETCH_EQUIPMENT_TYPE_DIRECTORY, { namespace: dictNamespace })
    public FetchEquipmentType: () => Promise<IDictionaryItem[]>;

    @Action(Actions.STORE_RULE, { namespace })
    public StoreRule: (model: IRule) => Promise<IRule>;

    @Getter(dictGetters.EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace})
    public readonly SeverityDictionary: IDictionaryItem[];

    @Getter(dictGetters.EQUIPMENT_TYPES_DICTIONARY, { namespace: dictNamespace })
    public readonly EquipmentDictionary: IDictionaryItem[];

    @Getter(Getters.TIME_PERIOD_DICTIONARY, { namespace })
    public readonly TimePeriodDictionary: IDictionaryItem[];

    public created(): void {
        if (this.SeverityDictionary.length === 0) {
            this.FetchSeverity();
            this.FetchEquipmentType();
        }
    }

    public mounted(): void {
        this.model = { ...this.Model };
        this.$parent.$on("store", () => this.store());
    }

    public beforeDestroy(): void {
        this.$parent.$off("store");
    }

    private isSaved: boolean = false;
    private errorText: string = "";

    private readonly: boolean = false;
    public IsLoading: boolean = false;

    private model: IRule = createRule();

    public cancel(): void {
        this.$emit("cancel");
    }

    public async store() {
        let conditionsExist = true;

        if (this.model.Conditions.length === 0) {
            this.$validator.errors.add(<FieldError> { field: "conditions", msg: "Должно быть выбрано хотя бы 1 условие" });
            conditionsExist = false;
        }
        this.$validator.validateAll().then((isValid) => {
            if (isValid && conditionsExist) {
                this.StoreRule(this.model)
                    .then((result) => {
                        this.isSaved = true;
                        setTimeout(() => this.isSaved = false, 5000);
                        this.$router.push({ path: "/EquipmentLogs/" + result.Id });
                    })
                    .catch((error) => this.errorText = error);
            }
        });
    }

    public addCondition(): void {
        this.model.Conditions.push(createCondition(this.model.Conditions.length));
        this.errors.remove("conditions");
    }

    public get descriptionTitle(): string {
        return this.model.Action === 0 ? "Описание инцидента" : "Текст письма";
    }

    public get conditions(): ICondition[] {
        return orderBy(this.model.Conditions, x => x.Position);
    }
    private moveUp(position: number): void {
        if (position > 0 && this.model.Conditions.length > 0) {
            const first = this.model.Conditions.find(x => x.Position === position);
            const second = this.model.Conditions.find(x => x.Position === (position - 1));

            if (first) {
                first.Position--;
            }
            if (second) {
                second.Position++;
            }
        }
    }

    private moveDown(position: number): void {
        if (position !== (this.model.Conditions.length - 1) && this.model.Conditions.length > 0) {
            const first = this.model.Conditions.find(x => x.Position === position);
            const second = this.model.Conditions.find(x => x.Position === (position + 1));

            if (first) {
                first.Position++;
            }
            if (second) {
                second.Position--;
            }
        }
    }

    private remove(position: number): void {
        if (this.model.Conditions.length > position) {
            this.model.Conditions.splice(position, 1);
            for (let i = position; i < this.model.Conditions.length; i++) {
                this.model.Conditions[i].Position--;
            }
        }
    }

    private get isOrdered(): boolean {
        if (this.model) {
            return Number(this.model.OnCondition) === 2 || Number(this.model.OnCondition) === 1;
        }
        return false;
    }

}
