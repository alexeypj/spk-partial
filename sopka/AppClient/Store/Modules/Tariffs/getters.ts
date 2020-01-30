import { GetterTree } from "vuex";
import { ITariff, ITariffsState, ITariffFilter } from "./types";
import { IRootState } from "../../types";
import { Getters } from "./constants";

export const getters: GetterTree<ITariffsState, IRootState> = {

    [Getters.FILTER](state: ITariffsState): ITariffFilter {
        return state.Filter;
    },

    [Getters.IS_LOADING](state: ITariffsState): boolean {
        return state.IsLoading;
    },

    [Getters.TARIFFS_LIST](state: ITariffsState): ITariff[] {
        return state.Tariffs;
    },

    [Getters.SELECTED_TARIFF_ID](state: ITariffsState): number|null {
        return state.SelectedTariffId;
    },


    [Getters.TARIFFS_TOTAL](state: ITariffsState): number {
        return state.Total;
    },

    [Getters.TARIFF_BY_ID](state: ITariffsState): (id: number) => ITariff|undefined {
        return (id: number): ITariff|undefined => {
            return state.Tariffs.find(x => x.Id === id);
        };
    }
};
