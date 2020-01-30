import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ICounter } from "../../../Store/Modules/Inventory/types";
import { isUserInRole } from "../../../Shared/utils";
import { Getter } from "vuex-class";
import { namespace, Getters } from "../../../Store/Modules/Common/constants";
import { IUser, Roles } from "../../../Store/Modules/Common/types";
import Charts from "./chart/index.vue";

@Component({
    components: {
        Charts
    }
})
export default class extends Vue {

    @Prop({ required: true })
    public readonly counters: ICounter[];

    @Getter(Getters.CURRENT_USER, { namespace })
    public readonly CurrentUser: IUser;

    get DisplayEquipments(): boolean {
        return true;
    }

    private get objectsTotal(): number {
        return this.getCounter("Objects");
    }

    private get equipmentTotal(): number {
        return this.getCounter("Equipment");
    }

    private get incidentsTotal(): number {
        return this.getCounter("Incidents");
    }

    private get objectIncidents(): number {
        return this.getCounter("ObjectIncidents");
    }

    private get equipmentIncidents(): number {
        return this.getCounter("EquipmentIncidents");
    }

    private get openIncidents(): number {
        return this.getCounter("OpenIncidents");
    }

    private get newIncidents(): number {
        return this.getCounter("NewIncidents");
    }

    private get criticalIncidents(): number {
        return this.getCounter("CriticalIncidents");
    }

    private getCounter(type: string) {
        const counter = this.counters.find(x => x.Type === type);
        if (counter) {
            return counter.Value;
        }
        return 0;
    }
}
