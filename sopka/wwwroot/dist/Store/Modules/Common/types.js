export class User {
    constructor() {
        this.Id = "";
        this.IsAuthenticated = false;
    }
    static getDefault() {
        return new User();
    }
}
export var Roles;
(function (Roles) {
    Roles["DutyShift"] = "\u0414\u0435\u0436\u0443\u0440\u043D\u0430\u044F \u0441\u043C\u0435\u043D\u0430 (\u043F\u0435\u0440\u0432\u0430\u044F \u043B\u0438\u043D\u0438\u044F, \u0426\u0435\u043D\u0442\u0440 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433\u0430, \u041F\u0410\u041E \u00AB\u041C\u041E\u042D\u0421\u041A\u00BB)'";
    Roles["CorporateCenterSecondLine"] = "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0446\u0435\u043D\u0442\u0440 (\u0432\u0442\u043E\u0440\u0430\u044F \u043B\u0438\u043D\u0438\u044F)";
    Roles["CorporateCenterFirstLine"] = "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0446\u0435\u043D\u0442\u0440 (\u0442\u0440\u0435\u0442\u044C\u044F \u043B\u0438\u043D\u0438\u044F)";
    Roles["Admin"] = "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440 \u0441\u0438\u0441\u0442\u0435\u043C\u044B";
})(Roles || (Roles = {}));
//# sourceMappingURL=types.js.map