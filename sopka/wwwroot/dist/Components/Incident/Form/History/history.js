var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { formatDate } from "../../../../Shared/utils";
import moment from "Moment";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.sortDirection = "desc";
        this.localHistory = [];
    }
    onHistoryChange(newVal) {
        this.localHistory = [...newVal];
        this.sortHistory();
    }
    getStatusName(id) {
        if (id) {
            const result = this.statusDictionary.find(x => x.Id === id);
            if (result) {
                return result.Name;
            }
        }
        return "";
    }
    dateFormat(date) {
        return formatDate(date, "DD.MM.YYYY HH:mm:ss");
    }
    getUser(userId) {
        const user = this.usersDictionary.find(x => x.Id === userId);
        if (user) {
            return user.FIO;
        }
        return "";
    }
    getFieldName(field) {
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
        }
        console.warn("Unknown field name ", field);
        return "";
    }
    getFieldValue(field, value) {
        switch (field) {
            case "FixationTime": return this.dateFormat(value);
            case "DecisionTime": return this.dateFormat(value);
            case "AttackType": return this.getAttackType(value);
            case "SourceEquipmentId": return this.getEquipment(value);
        }
        return value;
    }
    getAttackType(id) {
        const result = this.attackTypeDictionary.find(x => x.Key == id);
        if (result) {
            return result.Value;
        }
        return "";
    }
    getEquipment(id) {
        const result = this.equipmentDictionary.find(x => x.Id === Number(id));
        if (result) {
            return result.Name;
        }
        return "";
    }
    changeSortDirection() {
        this.sortDirection = this.sortDirection === "desc" ? "asc" : "desc";
        this.sortHistory();
    }
    sortHistory() {
        this.localHistory.sort((a, b) => {
            const aDate = moment(a.ChangeTime);
            if (aDate.isBefore(b.ChangeTime)) {
                return this.sortDirection === "desc" ? 1 : -1;
            }
            return this.sortDirection === "desc" ? -1 : 1;
        });
        this.localHistory.forEach(x => {
            if (x.FieldHistory && x.FieldHistory.length > 0) {
                x.FieldHistory.sort((a, b) => {
                    const aDate = moment(a.ChangeDate);
                    if (aDate.isBefore(b.ChangeDate)) {
                        return this.sortDirection === "desc" ? 1 : -1;
                    }
                    return this.sortDirection === "desc" ? -1 : 1;
                });
            }
        });
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "history", void 0);
__decorate([
    Prop({ required: true })
], default_1.prototype, "usersDictionary", void 0);
__decorate([
    Prop({ required: true })
], default_1.prototype, "statusDictionary", void 0);
__decorate([
    Prop({ required: true })
], default_1.prototype, "attackTypeDictionary", void 0);
__decorate([
    Prop({ required: true })
], default_1.prototype, "equipmentDictionary", void 0);
__decorate([
    Watch("history")
], default_1.prototype, "onHistoryChange", null);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=history.js.map