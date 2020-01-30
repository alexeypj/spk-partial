import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { IIncidentStatusHistory,
    IIncidentStatus,
    IIncidentHistoryFilter,
    GetDefaultHistoryFilter,
    IIncidentHistoryRecord
} from "../../../../Store/Modules/Incident/types";
import { IUser, IPaginationModel } from "../../../../Store/Modules/Common/types";
import { formatDate } from "../../../../Shared/utils";
import { IDictionaryItem, IEquipmentListItem } from "../../../../Store/Modules/Inventory/types";
import moment from "Moment";
import { IColumnOptions } from "../../../../Shared/Datatable/types";
import Datatable from "../../../../Shared/Datatable/Datatable.vue";
import { namespace, Getters, Actions } from "../../../../Store/Modules/Incident/constants";

@Component({
    components: {
        Datatable
    }
})
export default class extends Vue {

    @Prop({ required: true})
    public Id: number;

    @Prop({ required: true})
    public usersDictionary: IUser[];

    @Prop({ required: true })
    public statusDictionary: IIncidentStatus[];

    @Prop({ required: true })
    public attackTypeDictionary: IDictionaryItem[];

    @Prop({ required: true})
    public equipmentDictionary: IEquipmentListItem[];

    @Prop({ required: true })
    public criticalityDictionary: IDictionaryItem[];

    @Action(Actions.FETCH_HISTORY, { namespace })
    public FetchHistory: (filter: IIncidentHistoryFilter) => Promise<IPaginationModel<IIncidentStatusHistory>>;

    @Watch("Id")
    public onModelChange(newVal: number): void {
        if (newVal) {
            this.filter.Id = newVal;
            this.fetchHistory(this.filter);
        }
    }

    private sortDirection = "desc";
    private filter: IIncidentHistoryFilter = GetDefaultHistoryFilter(0);
    private history: IIncidentHistoryRecord[] = [];
    private totalItems: number = 0;

    public async mounted() {
        if (this.Id) {
            this.filter.Id = this.Id;
            await this.fetchHistory(this.filter);
        }
    }

    private async fetchHistory(filter: IIncidentHistoryFilter) {
        const data = await this.FetchHistory(filter);
        this.history = this.transformHistory(data.Items)    ;
        this.totalItems = data.Total;
    }

    private getStatusName(id: number|undefined): string {
        if (id) {
            const result = this.statusDictionary.find(x => x.Id === id);
            if (result) {
                return result.Name;
            }
        }
        return "";
    }

    private transformHistory(data: IIncidentStatusHistory[]): IIncidentHistoryRecord[] {
        const records: IIncidentHistoryRecord[] = [];
        for (const fieldRecord of data) {
            if (fieldRecord.FieldHistory) {
                for (const field of fieldRecord.FieldHistory) {
                    records.push(<IIncidentHistoryRecord> {
                        Id: field.Id,
                        Field: this.getFieldName(field.FieldName),
                        NewValue: this.getFieldValue(field.FieldName, field.NewVal),
                        OldValue: this.getFieldValue(field.FieldName, field.OldVal),
                        ChangeDate: this.dateFormat(field.ChangeDate),
                        User: this.getUser(field.IdUser)
                    });
                }
            }
        }
        return records;
    }

    private dateFormat(date: Date): string {
        return formatDate(date, "DD.MM.YYYY HH:mm:ss");
    }

        private getUser(userId: string): string {
        const user = this.usersDictionary.find(x => x.Id === userId);
        if (user) {
            return user.FIO;
        }
        return "";
    }

    private getFieldName(field: string): string {
        switch (field) {
            case "AttackType": return "Тип атаки";
            case "DecisionTime": return "Время окончания";
            case "Description": return "Описание";
            case "DetectionMethod": return "Способ выявления";
            case "SourceAddress": return "Адрес";
            case "SourceCountry": return "Страна";
            case "SourceEquipmentId": return "Оборудование";
            case "SourceIP": return "IP адрес";
            case "SourceURL": return "URL";
            case "FixationTime": return "Время фиксации";
            case "RelatedIncidents": return "Связанные инциденты";
            case "PreventionRecommendations": return "Рекомендации по предотвращению";
            case "MitigationRecommendations": return "Рекомендации по устранению последствий";
            case "BlockingRecommendations": return "Рекомендации по блокировке";
            case "Title": return "Заголовок";
            case "Criticality": return "Критичность";
            case "SeverityId": return "Критичность";
        }
        console.warn("Unknown field name ", field);
        return "";
    }

    private getFieldValue(field: string, value: string): string {
        switch (field) {
            case "FixationTime": return this.dateFormat(value as any);
            case "DecisionTime": return this.dateFormat(value as any);
            case "AttackType": return this.getAttackType(value);
            case "SourceEquipmentId": return this.getEquipment(value);
            case "Criticality": return this.getCriticality(value);
        }
        return value;
    }

    private getAttackType(id: string): string {
        const result = this.attackTypeDictionary.find(x => x.Key == id);
        if (result) {
            return result.Value;
        }
        return "";
    }

    private getCriticality(id?: string): string {
        if (id) {
            const result = this.criticalityDictionary.find(x => x.Key == id);
            if (result) {
                return result.Value;
            }
        }
        return "";
    }

    private getEquipment(id: string): string {
        const result = this.equipmentDictionary.find(x => x.Id === Number(id));
        if (result) {
            return result.Name;
        }
        return "";
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "Id", Sort: true, SortColumnName: "Id"},
        { Name: "Field", DisplayName: "Поле", Sort: true, SortColumnName: "Field" },
        { Name: "NewValue", DisplayName: "Новое значение", Sort: true, SortColumnName: "NewValue" },
        { Name: "OldValue", DisplayName: "Старое значение", Sort: true, SortColumnName: "OldValue" },
        { Name: "ChangeDate", DisplayName: "Дата изменения", Sort: true, SortColumnName: "ChangeDate" },
        { Name: "User", DisplayName: "Кто поменял", Sort: true, SortColumnName: "User" },
        { Name: "Comment", DisplayName: "Коментарий", Sort: false, SortColumnName: "Comment" }
    ];
}
