import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IIncidentArticle, IKnowledgeBaseDictionaries } from "../../../../Store/Modules/KnowledgeBase/types";
import { formatDate } from "../../../../Shared/utils";

@Component
export default class RelatedIncidents extends Vue {

    @Prop({ required: true })
    public readonly Incidents: IIncidentArticle[];

    @Prop({ required: true })
    public readonly Dictionaries: IKnowledgeBaseDictionaries;

    private getAttachType(id?: number): string {
        if (id) {
            const attackType = this.Dictionaries.AttackTypes.find(x => x.Key === id);
            if (attackType) {
                return attackType.Value;
            }
        }
        return "";
    }

    private dateFormat(date: Date): string {
        return formatDate(date, "DD.MM.YYYY HH:mm:ss");
    }

    private getType(type: number): string {
        if (type === 0) {
            return "Статья основана на инциденте";
        }
        if (type === 1) {
            return "Статья решает инцидент";
        }
        if (type === 2) {
            return "Статья основана на инциденте и решает его";
        }
        return "";
    }
}
