import { OnConditions, Actions, TimePeriods } from "./types";
import { Getters } from "./constants";
import { plural } from "../../../Shared/utils";
export const getters = {
    [Getters.CURRENT_FILTER](state) {
        return state.Filter;
    },
    [Getters.IS_LIST_LOADING](state) {
        return state.Loading.IsLoading;
    },
    [Getters.RULES_LIST](state) {
        return state.RulesList;
    },
    [Getters.ON_CONDITION_DICTIONARY](state) {
        const result = [];
        const keys = Object.keys(OnConditions).filter(x => !isNaN(Number(x)));
        for (const key of keys) {
            result.push({ Key: key, Value: OnConditions[key] });
        }
        return result;
    },
    [Getters.ACTION_DICTIONARY](state) {
        const result = [];
        const keys = Object.keys(Actions).filter(x => !isNaN(Number(x)));
        for (const key of keys) {
            result.push({ Key: key, Value: Actions[key] });
        }
        return result;
    },
    [Getters.TIME_PERIOD_DICTIONARY](state) {
        const result = [];
        const keys = Object.keys(TimePeriods).filter(x => !isNaN(Number(x)));
        for (const key of keys) {
            result.push({ Key: key, Value: TimePeriods[key] });
        }
        return result;
    },
    [Getters.IS_RULE_SAVING](state) {
        return state.Loading.IsSaving;
    },
    [Getters.RULES_LIST_TOTAL](state) {
        return state.RulesCount;
    },
    [Getters.FORMAT_RULE](state) {
        const conditions = ["хотя бы одного условия", "всех условий", "всех условий в определенном порядке"];
        const periods = [
            ["секунду", "секуды", "секунд"],
            ["минуту", "минуты", "минут"],
            ["час", "часа", "часов"]
        ];
        const periodsAccusative = [
            ["секунды", "секунд", "секунд"],
            ["минуты", "минут", "минут"],
            ["часа", "часов", "часов"],
        ];
        return (rule, equipments, severity) => {
            const builder = [];
            let cond = `При выполнении ${conditions[rule.OnCondition]}`;
            if (rule.OnCondition === 2) {
                cond += ` в течение ${rule.OnConditionPeriodLength}
        ${plural(rule.OnConditionPeriodLength || 0, periodsAccusative[rule.OnCondition][0], periodsAccusative[rule.OnCondition][1], periodsAccusative[rule.OnCondition][2])}`;
            }
            builder.push(cond);
            rule.Conditions.forEach(condition => {
                const equipment = equipments.find(x => x.Key === condition.EquipmentId).Value || "";
                const crit = severity.find(x => x.Key === condition.SeverityId).Value || "";
                builder.push(`&ndash; Если критичность ошибки <strong>${crit}</strong>
         и тип оборудования <strong>${equipment}</strong> и текст ошибки содержит <strong>${condition.ErrorBody}</strong>
         и число ошибок более <strong>${condition.ErrorsNumber}</strong> в <strong>${condition.PeriodLength}</strong><strong>
         ${plural(condition.PeriodLength, periods[condition.Period][0], periods[condition.Period][1], periods[condition.Period][2])}
         </strong>`);
            });
            if (rule.Action === 1) {
                builder.push(`Отправить письмо на почту ${rule.EmailAddress}`);
            }
            else {
                builder.push(`Создать инцидент`);
            }
            return builder.join("<br />");
        };
    },
    [Getters.IS_RULE_LOADING](state) {
        return state.Loading.IsOneLoading;
    }
};
//# sourceMappingURL=getters.js.map