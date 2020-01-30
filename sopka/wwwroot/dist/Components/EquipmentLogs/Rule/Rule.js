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
import { Component, Prop } from "vue-property-decorator";
import { createCondition, createRule } from "../../../Store/Modules/EquipmentLogs/types";
import { Getter, Action } from "vuex-class";
import { Actions, Getters, namespace } from "../../../Store/Modules/EquipmentLogs/constants";
import select2 from "../../../Shared/Select2/select2.vue";
import { Actions as dictActions, Getters as dictGetters, namespace as dictNamespace } from "../../../Store/Modules/Dictionaries/constants";
import { orderBy } from "lodash";
let Rule = class Rule extends Vue {
    constructor() {
        super(...arguments);
        this.isSaved = false;
        this.errorText = "";
        this.readonly = false;
        this.IsLoading = false;
        this.model = createRule();
    }
    created() {
        if (this.SeverityDictionary.length === 0) {
            this.FetchSeverity();
            this.FetchEquipmentType();
        }
    }
    mounted() {
        this.model = Object.assign({}, this.Model);
        this.$parent.$on("store", () => this.store());
    }
    beforeDestroy() {
        this.$parent.$off("store");
    }
    cancel() {
        this.$emit("cancel");
    }
    store() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.model.Conditions.length === 0) {
                this.$validator.errors.add({ field: "conditions", msg: "Должно быть выбрано хотя бы 1 условие" });
            }
            this.$validator.validateAll().then((isValid) => {
                if (isValid) {
                    this.StoreRule(this.model)
                        .then((result) => {
                        this.isSaved = true;
                        setTimeout(() => this.isSaved = false, 5000);
                        this.$emit("stored");
                        this.$router.push({ path: "/EquipmentLogs/" + result.Id });
                    })
                        .catch((error) => this.errorText = error);
                }
            });
        });
    }
    addCondition() {
        this.model.Conditions.push(createCondition(this.model.Conditions.length));
        this.errors.remove("conditions");
    }
    get descriptionTitle() {
        return this.model.Action === 0 ? "Описание инцидента" : "Текст письма";
    }
    get conditions() {
        return orderBy(this.model.Conditions, x => x.Position);
    }
    moveUp(position) {
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
    moveDown(position) {
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
    get isOrdered() {
        if (this.model) {
            return Number(this.model.OnCondition) === 2;
        }
        return false;
    }
};
__decorate([
    Prop({ required: true })
], Rule.prototype, "Model", void 0);
__decorate([
    Getter(Getters.ON_CONDITION_DICTIONARY, { namespace })
], Rule.prototype, "OnConditionsDictionary", void 0);
__decorate([
    Getter(Getters.ACTION_DICTIONARY, { namespace })
], Rule.prototype, "ActionDictionary", void 0);
__decorate([
    Action(dictActions.FETCH_EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace })
], Rule.prototype, "FetchSeverity", void 0);
__decorate([
    Action(dictActions.FETCH_EQUIPMENT_TYPE_DIRECTORY, { namespace: dictNamespace })
], Rule.prototype, "FetchEquipmentType", void 0);
__decorate([
    Action(Actions.STORE_RULE, { namespace })
], Rule.prototype, "StoreRule", void 0);
__decorate([
    Getter(dictGetters.EQUIPMENT_LOG_SEVERITY, { namespace: dictNamespace })
], Rule.prototype, "SeverityDictionary", void 0);
__decorate([
    Getter(dictGetters.EQUIPMENT_TYPES_DICTIONARY, { namespace: dictNamespace })
], Rule.prototype, "EquipmentDictionary", void 0);
__decorate([
    Getter(Getters.TIME_PERIOD_DICTIONARY, { namespace })
], Rule.prototype, "TimePeriodDictionary", void 0);
Rule = __decorate([
    Component({
        components: {
            select2
        }
    })
], Rule);
export default Rule;
//# sourceMappingURL=Rule.js.map