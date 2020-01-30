import { GetterTree } from "vuex";
import { IEquipmentLogsState, IEquipmentLogsFilter, IRule, OnConditions, Actions, TimePeriods } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";
import { IDictionaryItem } from "../Inventory/types";
import { plural } from "../../../Shared/utils";

export const getters: GetterTree<IEquipmentLogsState, IRootState> = {

  [Getters.CURRENT_FILTER](state: IEquipmentLogsState): IEquipmentLogsFilter {
    return state.Filter;
  },

  [Getters.IS_LIST_LOADING](state: IEquipmentLogsState): boolean {
    return state.Loading.IsLoading;
  },

  [Getters.RULES_LIST](state: IEquipmentLogsState): IRule[] {
    return state.RulesList;
  },

  [Getters.ON_CONDITION_DICTIONARY](state: IEquipmentLogsState): IDictionaryItem[] {
    const result: IDictionaryItem[] = [];
    const keys = Object.keys(OnConditions).filter(x => !isNaN(Number(x)));
    for (const key of keys) {
      result.push(<IDictionaryItem> { Key: key, Value: OnConditions[key] });
    }
    return result;
  },

  [Getters.ACTION_DICTIONARY](state: IEquipmentLogsState): IDictionaryItem[] {
    const result: IDictionaryItem[] = [];
    const keys = Object.keys(Actions).filter(x => !isNaN(Number(x)));
    for (const key of keys) {
      result.push(<IDictionaryItem> { Key: key, Value: Actions[key] });
    }
    return result;
  },

  [Getters.TIME_PERIOD_DICTIONARY](state: IEquipmentLogsState): IDictionaryItem[] {
    const result: IDictionaryItem[] = [];
    const keys = Object.keys(TimePeriods).filter(x => !isNaN(Number(x)));
    for (const key of keys) {
      result.push(<IDictionaryItem> { Key: key, Value: TimePeriods[key] });
    }
    return result;
  },

  [Getters.IS_RULE_SAVING](state: IEquipmentLogsState): boolean {
    return state.Loading.IsSaving;
  },

  [Getters.RULES_LIST_TOTAL](state: IEquipmentLogsState): number {
    return state.RulesCount;
  },

  [Getters.FORMAT_RULE](state: IEquipmentLogsState):
    (rule: IRule, equipments: IDictionaryItem[], criticality: IDictionaryItem[]) => string {
    const conditions = ["хотя бы одного условия", "всех условий", "всех условий в определенном порядке"];
    const periods = [
      ["секунду", "секуды", "секунд"],
      ["минуту" , "минуты", "минут"],
      ["час", "часа", "часов"]
    ];

    const periodsAccusative = [
      ["секунды", "секунд", "секунд"],
      ["минуты", "минут", "минут"],
      ["часа", "часов", "часов"],

    ];
    return (rule: IRule, equipments: IDictionaryItem[], severity: IDictionaryItem[]) => {
      const builder: string[] = [];
      let cond: string = `При выполнении ${conditions[rule.OnCondition]}`;
      if (rule.OnCondition === 2) {
        cond += ` в течение ${rule.OnConditionPeriodLength}
        ${plural(rule.OnConditionPeriodLength || 0,
          periodsAccusative[rule.OnCondition][0],
          periodsAccusative[rule.OnCondition][1],
          periodsAccusative[rule.OnCondition][2])}`;
      }
      builder.push(cond);

      rule.Conditions.forEach(condition => {
        const equipment = equipments.find(x => x.Key === condition.EquipmentId)!.Value || "";
        const crit = severity.find(x => x.Key === condition.SeverityId)!.Value || "";

        builder.push(`&ndash; Если критичность ошибки <strong>${crit}</strong>
         и тип оборудования <strong>${equipment}</strong> и текст ошибки содержит <strong>${condition.ErrorBody}</strong>
         и число ошибок более <strong>${condition.ErrorsNumber}</strong> в <strong>${condition.PeriodLength}</strong><strong>
         ${plural(condition.PeriodLength, periods[condition.Period][0], periods[condition.Period][1], periods[condition.Period][2])}
         </strong>`);
      });

      if (rule.Action === 1) {
        builder.push(`Отправить письмо на почту ${rule.EmailAddress}`);
      } else {
        builder.push(`Создать инцидент`);
      }
      return builder.join("<br />");
    };
  },

  [Getters.IS_RULE_LOADING](state: IEquipmentLogsState): boolean {
    return state.Loading.IsOneLoading;
  },

};
