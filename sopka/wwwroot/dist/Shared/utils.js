import moment from "moment";
export function urlHelper(action, controller) {
    return `${window.baseUrl}${controller}/${action}`;
}
/** Логгирование ошибки */
export function logError(message) {
    console.error(message);
}
/** Логгирование предупреждения */
export function logWarn(message) {
    console.warn(message);
}
/** Отображение ошибки в окне bootBox */
export function showErrorMessage(message) {
    bootbox.alert(message);
}
/** Форматирование даты */
export function formatDate(date, format) {
    if (!format) {
        format = "DD.MM.YYYY HH:mm";
    }
    return moment(date).format(format);
}
export function isUserInRole(user, role) {
    for (let userRole of user.UserRoles) {
        if (userRole.Name === role) {
            return true;
        }
    }
    return false;
}
export function logAction(actionName, entityType = null, entityId = null, additionalParams = null) {
    var data = {
        actionName,
        entityType,
        entityId,
        additionalParams
    };
    $.ajax(urlHelper("Log", "LogAction"), {
        url: urlHelper("Log", "LogAction"),
        type: "POST",
        cache: false,
        data: data
    });
}
/** Образование множественного числа, пример:  'голос', 'голоса', 'голосов' */
export function plural(num, form1, form2, form5) {
    num = Math.abs(num) % 100;
    const n1 = num % 10;
    if (num > 10 && num < 20) {
        return form5;
    }
    if (n1 > 1 && n1 < 5) {
        return form2;
    }
    if (n1 === 1) {
        return form1;
    }
    return form5;
}
//# sourceMappingURL=utils.js.map