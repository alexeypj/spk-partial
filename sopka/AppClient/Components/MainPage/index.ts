import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Actions, namespace } from "../../Store/Modules/Inventory/constants";
import { Actions as commonActions, Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";

import infTable from "./infTable/infTable.vue";
import smallMessage from "./smallMessage/smallMessage.vue";
import mailBoard from "./mailBoard/mailBoard.vue";
import SmallMap from "./smallMap/smallMap.vue";
import { Action, Getter } from "vuex-class";
import { ISummary } from "../../Store/Modules/Inventory/types";
import { ISopkaSettings } from "../../Store/Modules/Common/types";

@Component({
    components: {
        infTable,
        smallMessage,
        mailBoard,
        SmallMap
    }
})
export default class MainPage extends Vue {

    @Action(Actions.FETCH_SUMMARY, { namespace })
    private FetchSummary: () => Promise<ISummary>;

    @Action(commonActions.FETCH_SETTINGS, { namespace: commonNamespace })
    private FetchSettings: () => Promise<ISopkaSettings>;

    @Getter(commonGetters.SETTINGS, { namespace: commonNamespace })
    public readonly Settings: ISopkaSettings;

    private summary: ISummary = {
        Objects: [],
        Counters: []
    };

    private initialized: boolean = false;

    public mounted(): void {
        this.FetchSettings();

        this.FetchSummary().then((result) => {
            this.summary = result;
            this.initialized = true;
        });
    }
}
