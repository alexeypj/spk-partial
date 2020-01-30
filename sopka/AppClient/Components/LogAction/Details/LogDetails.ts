import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/LogAction/constants";
import {
    ILogActionState, ILogActionFilter, ILogActionDictionaries, GetDefaultFilter, ILogAction
} from "../../../Store/Modules/LogAction/types";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";

@Component
export default class LogDetails extends Vue {
    @Getter(Getters.GET_SELECTED_LOG, {namespace: namespace})
    public SelectedLog: ILogAction | null;

    get logParameters(): IDictionaryItem[] {
        if (!this.SelectedLog || !this.SelectedLog.Parameters) {
            return [];
        }
        return this.mapObjectToKeyValue(this.SelectedLog.Parameters);
    }

    get headers(): IDictionaryItem[] {
        if (!this.SelectedLog || !this.SelectedLog.Headers) {
            return [];
        }
        return this.mapObjectToKeyValue(this.SelectedLog.Headers);
    }

    mapObjectToKeyValue(object: string): IDictionaryItem[] {
        var paramsObj = JSON.parse(object);
        if (Object.keys(paramsObj).length === 0) {
            return [];
        }

        let params: IDictionaryItem[] = [];

        for (var key in paramsObj) {
            if (!paramsObj.hasOwnProperty(key)) {
                continue;
            }
            let content: string = "";
            if (paramsObj[key] instanceof Object) {
                content = JSON.stringify(paramsObj[key]);
            } else {
                content = paramsObj[key];
            }
            params.push({ Key: key, Value: content });
        }
        return params;
    }
}
