export function GetDefaultFilter() {
    return {
        AttackType: undefined,
        Title: undefined,
        FixationTime: undefined,
        Status: undefined,
        ResponsibleRoleId: undefined,
        CreatorId: undefined,
        ObjectId: undefined,
        EquipmentId: undefined,
        PlatformId: undefined,
        Country: undefined,
        ShowClosed: false,
        Page: 1,
        ItemsPerPage: 15,
        SortColumn: "Id",
        SortDirection: "DESC"
    };
}
export var TagsMap;
(function (TagsMap) {
    TagsMap["AttackType"] = "\u0422\u0438\u043F \u0430\u0442\u0430\u043A\u0438";
    TagsMap["EquipmentType"] = "\u0422\u0438\u043F \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F";
    TagsMap["Platforms"] = "\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430";
    TagsMap["Memory"] = "\u041F\u0430\u043C\u044F\u0442\u044C";
    TagsMap["CPU"] = "\u041F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440";
    TagsMap["Raids"] = "\u0422\u0438\u043F \u0440\u0435\u0439\u0434\u0430";
    TagsMap["HDD"] = "\u0416\u0435\u0441\u0442\u043A\u0438\u0439 \u0434\u0438\u0441\u043A";
    TagsMap["NetworkAdapters"] = "\u0421\u0435\u0442\u0435\u0432\u043E\u0439 \u0430\u0434\u0430\u043F\u0442\u0435\u0440";
    TagsMap["Software"] = "\u041F\u041E";
    TagsMap["OS"] = "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0435 \u041F\u041E";
})(TagsMap || (TagsMap = {}));
//# sourceMappingURL=types.js.map