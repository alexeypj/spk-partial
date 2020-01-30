import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { Actions as commonActions, Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import { ISopkaSettings } from "../../Store/Modules/Common/types";

@Component
export default class NoDemo extends Vue {
    @Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
    private FetchSettings: () => Promise<ISopkaSettings>;

    @Getter(commonGetters.SETTINGS, { namespace: commonNamespace })
    public readonly Settings: ISopkaSettings;

    mounted() {
        this.FetchSettings();
    }
}