import moment from "moment";
import { IUser } from "../Store/Modules/Common/types";
import { LogActions, EntityType } from "./LogActions";
import Axios from "axios";
import { losingChangesConfirmation } from "../Store/Modules/Common/constants";


export function urlHelper(action: string, controller: string): string {
	return `${window.baseUrl}${controller}/${action}`;
}

/** Логгирование ошибки */
export function logError(message : string): void {
	console.error(message);
}

/** Логгирование предупреждения */
export function logWarn(message : string): void {
	console.warn(message);
}

/** Отображение ошибки в окне bootBox */
export function showErrorMessage(message : string): void {
	bootbox.alert(message);
}

/** Форматирование даты */
export function formatDate(date: Date, format?: string): string {
	if (!format) {
		format = "DD.MM.YYYY HH:mm";
	}

	return moment(date).format(format);
}

export function isUserInRole(user: IUser, role: string): boolean {
    for (let userRole of user.UserRoles) {
        if (userRole.Name === role) {
            return true;
        }
    }
    return false;
}

export function logAction(actionName: string, entityType: EntityType | null = null, entityId: string | null = null,
    additionalParams: any | null = null, entityTitle: string | null = null): void {
    var data = {
        actionName,
        entityType,
        entityId,
        additionalParams,
        entityTitle
    };
    $.ajax(urlHelper("Log", "LogAction"), {
        url: urlHelper("Log", "LogAction"),
        type: "POST",
        cache: false,
        data: data
    });
}

/** Образование множественного числа, пример:  'голос', 'голоса', 'голосов' */
export function plural(num: number, form1: string, form2: string, form5: string): string {
    num = Math.abs(num) % 100;
    const n1: number = num % 10;
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

export function bootboxLosingChangesConfirmation(confirmCallback: () => void, cancelCallback?: () => void, headerText?: string): void {
    var dialog = bootbox.confirm({
        message: headerText || losingChangesConfirmation,
        animate: false,
        className: "modal-confirmation",
        buttons: {
            confirm: {
                label: "Да",
                className: "btn-success btn-primary"
            },
            cancel: {
                label: "Отмена",
                className: "btn-white"
            },

        },
        callback: (result: boolean) => {
            if (result) {
                confirmCallback();
            } else if (cancelCallback) {
                cancelCallback();
            }
        },
    });
}

export function removeConfirmation(headerText: string, confirmCallback: () => void, cancelCallback?: () => void): void {
    var dialog = bootbox.confirm({
        message: headerText,
        animate: false,
        className: "bootbox-remove",
        buttons: {
            confirm: {
                label: "Удалить",
                className: "btn-danger"
            },
            cancel: {
                label: "Отмена",
                className: "btn-white"
            }
        },
        callback: (result: boolean) => {
            if (result) {
                confirmCallback();
            } else if (cancelCallback) {
                cancelCallback();
            }
        },
    });
}
