export function createRule() {
    return {
        Id: 0,
        Name: "",
        IsActive: true,
        OnCondition: 0,
        Action: 0,
        Conditions: [],
        EmailAddress: undefined,
        Description: undefined,
        DateCreate: undefined,
        CreatorId: ""
    };
}
export function createCondition(position) {
    return {
        Id: 0,
        RuleId: 0,
        Position: position,
        EquipmentId: undefined,
        SeverityId: undefined,
        ErrorBody: "",
        ErrorsNumber: 0,
        PeriodLength: 0,
        Period: 0
    };
}
export function createFilter() {
    return {
        Name: "",
        Page: 1,
        ItemsPerPage: 20,
        SortColumn: "Id",
        SortDirection: "DESC"
    };
}
export var OnConditions;
(function (OnConditions) {
    OnConditions[OnConditions["\u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u043E"] = 0] = "\u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u043E";
    OnConditions[OnConditions["\u0432\u0441\u0435"] = 1] = "\u0432\u0441\u0435";
    OnConditions[OnConditions["\u0432\u0441\u0435 \u0432 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435"] = 2] = "\u0432\u0441\u0435 \u0432 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043D\u043E\u043C \u043F\u043E\u0440\u044F\u0434\u043A\u0435";
})(OnConditions || (OnConditions = {}));
export var Actions;
(function (Actions) {
    Actions[Actions["\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0438\u043D\u0446\u0438\u0434\u0435\u043D\u0442"] = 0] = "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0438\u043D\u0446\u0438\u0434\u0435\u043D\u0442";
    Actions[Actions["\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0430 \u043F\u043E\u0447\u0442\u0443"] = 1] = "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0430 \u043F\u043E\u0447\u0442\u0443";
})(Actions || (Actions = {}));
export var TimePeriods;
(function (TimePeriods) {
    TimePeriods[TimePeriods["\u0441\u0435\u043A\u0443\u043D\u0434\u044B"] = 0] = "\u0441\u0435\u043A\u0443\u043D\u0434\u044B";
    TimePeriods[TimePeriods["\u043C\u0438\u043D\u0443\u0442\u044B"] = 1] = "\u043C\u0438\u043D\u0443\u0442\u044B";
    TimePeriods[TimePeriods["\u0447\u0430\u0441\u044B"] = 2] = "\u0447\u0430\u0441\u044B";
})(TimePeriods || (TimePeriods = {}));
//# sourceMappingURL=types.js.map