import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/LogAction/constants";
import { ILogActionDictionaries, ILogActionFilter, ILogActionState, ILogAction, GetDefaultFilter } from "../../../Store/Modules/LogAction/types";

@Component
export default class LogDetailsCell extends Vue {
    @Prop({ required: true })
    Item: ILogAction;

    @Mutation(Mutations.SET_SELECTED_LOG, { namespace: namespace })
    SetSelectedLog: (log: ILogAction) => void;
}