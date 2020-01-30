import Vue from "vue";
import Entry from "./Entry.vue";
import VueRouter from "vue-router";
import { RouteConfig } from "vue-router";
import { store } from "../../Store/index";
import { Roles, ICommon, IAppRole } from "../../Store/Modules/Common/types";
import { isUserInRole } from "../../Shared/utils";

// webpack chunks
const MainPage = () => import("../MainPage/index.vue");
const Equipment = () => import("../Equipment/index.vue");
const Inventory = () => import("../Inventory/index.vue");
const Incident = () => import("../Incident/index.vue");
const User = () => import("../Users/index.vue");
const KnowledgeBase = () => import("../KnowledgeBase/index.vue");
const Dictionaries = () => import("../Dictionaries/index.vue");
const Login = () => import("../Login/index.vue");
const ResetPassword = () => import("../Login/ResetPassword.vue");
const FilePreview = () => import("../FilePreview/index.vue");
const LogAction = () => import("../LogAction/index.vue");
const EquipmentLogs = () => import("../EquipmentLogs/EquipmentLogs.vue");
const EquipmentJournals = () => import("../EquipmentJournals/index.vue");
const Vulnerabilities = () => import("../Vulnerabilities/index.vue");
const Companies = () => import("../Companies/index.vue");
const CompanyCard = () => import("../CompanyCard/index.vue");
const Registration = () => import("../Login/Registration/index.vue");
const NoDemo = () => import("../Login/NoDemo.vue");
const Tariffs = () => import("../Tariffs/index.vue");

import VeeValidate, { Validator, Configuration } from "vee-validate";
import RuLocalization from "vee-validate/dist/locale/ru.js";

const phoneNumber: any = {
    getMessage(field: string): string {
        return "Введите действительный телефонный номер";
    },
    validate(value: string): boolean {
        const reg: RegExp = new RegExp("^\\+?[0-9\(\)\\s\\.\\w\\-\u0430-\u044f]+$");
        return reg.test(value);
    }
};
Validator.extend("phoneNumber", phoneNumber);
Validator.localize("ru", RuLocalization);
const validatorConfig: object = { locale: "ru", fieldsBagName: "formFields"};
Vue.use<Configuration>(VeeValidate, validatorConfig);
Vue.use(VueRouter);

import DatePick from "vue-date-pick";
import Component from "vue-class-component";
Vue.component("DatePickRFX", {
    extends: DatePick,
    props: {
        format: {
            type: String,
            default: "YYYY-MM-DD HH:mm"
        },
        nextMonthCaption: {
            type: String,
            default: "Следующий месяц"
        },
        prevMonthCaption: {
            type: String,
            default: "Предыдущий месяц"
        },
        setTimeCaption: {
            type: String,
            default: "Время"
        },
        weekdays: {
            type: Array,
            default: () => (["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"])
        },
        months: {
            type: Array,
            default: () => (["Январь", "Февраль", "Март", "Апрель",
            "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"])
        }
    }
});

Component.registerHooks([
    "beforeRouteLeave"
]);

const router: VueRouter = new VueRouter({
    mode: "history",
    linkActiveClass: "active",
    linkExactActiveClass: "exact-active",
    base: window.publicPath,
    routes: [
        {
            path: "",
            component: MainPage,
            meta: {
                 auth: {
                     required: true
                 }
            }
        },
        {
            path: "/Equipment/:Id?",
            component: Equipment,
            props: true,
            meta: { auth: { required: true } }
        },
        {
            path: "/Inventory/:Id?",
            component: Inventory,
            props: true,
            meta: { auth: { required: true } }
        },
        {
            path: "/Incident/:Id?",
            component: Incident,
            meta: { auth: { required: true } },
            props: (route) => {
                return { ...route.query, ...route.params };
            }
        },
        {
            path: "/Users",
            component: User,
            props: true,
            meta: { auth: { required: true, roles: [Roles.Admin, Roles.CompanyAdmin] } }
        },
        {
            path: "/KnowledgeBase/:Id?",
            component: KnowledgeBase,
            props: true,
            meta: { auth: { required: true } }
        },
        {
            path: "/Dictionaries",
            component: Dictionaries,
            meta: { auth: { required: true, superAdminOnly: true } }
        },
        {
            path: "/Login",
            component: Login
        },
        {
            path: "/Login/Registration",
            component: Registration,
            props: (route) => {
                return route.query;
            },
            meta: {
                restrictIfLimited: true
           }
        },
        {
            path: "/Login/Registration/Local",
            component: Registration,
            props: (route) => {
                return { ...route.query, tariff: "local" }
            },
            meta: {
                restrictIfLimited: true
           }
        },
        {
            path: "/Login/Registration/Cloud",
            component: Registration,
            props: (route) => {
                return { ...route.query, tariff: "cloud" }
            },
            meta: {
                 restrictIfLimited: true
            }
        },
        {
            path: "/Login/ResetPassword",
            component: ResetPassword,
            meta: {
                restrictIfLimited: true
           }
        },
        {
            path: "/FilePreview/:Id",
            component: FilePreview,
            props: true,
            meta: {
                 auth: {
                     required: true,
                 }
            }
        },
        {
            path: "/LogAction",
            component: LogAction,
            props: true,
            meta: {
                 auth: {
                    required: true,
                    roles: [Roles.Admin, Roles.CompanyAdmin]
                 }
            }
        },
        {
            path: "/EquipmentLogs/:Id?",
            component: EquipmentLogs,
            props: true,
            meta: {
                auth: {
                    required: true
                },
                restrictIfLimited: true

            }
        },
        {
            path: "/EquipmentJournals",
            component: EquipmentJournals,
            meta: {
                auth: {
                    required: true
                },
                restrictIfLimited: true
            },
            props: (route) => {
                return { ...route.query, ...route.params };
            }
        },
        {
            path: "/Vulnerabilities/:Id?",
            component: Vulnerabilities,
            props: true,
            meta: {
                auth: {
                    required: true
                },
                restrictIfLimited: true
            }
        },
        {
            path: "/Companies",
            component: Companies,
            props: true,
            meta: {
                auth: {
                    required: true,
                    superAdminOnly: true
                }
            }
        },
        {
            path: "/CompanyCard",
            component: CompanyCard,
            props: true,
            meta: {
                auth: {
                    required: true,
                    companyOnly: true,
                    roles: [Roles.CompanyAdmin]
                }
            }
        },
        {
            path: "/Tariffs/:Id?",
            component: Tariffs,
            props: true,
            meta: {
                auth: {
                    required: true,
                    superAdminOnly: true,
                    roles: [Roles.Admin]
                }
            }
        },
        {
            path: "/Login/NoDemo",
            component: NoDemo
        }
    ]
});

router.beforeEach(checkAccess);

//#region Buttons
import ErrorText from "../../Shared/ErrorText/errorText.vue";
import SaveButton from "../../Shared/Buttons/Save/saveButton.vue";
import CancelButton from "../../Shared/Buttons/Cancel/cancelButton.vue";
import DeleteButton from "../../Shared/Buttons/Delete/deleteButton.vue";

Vue.component("error-text", ErrorText);
Vue.component("save-button", SaveButton);
Vue.component("cancel-button", CancelButton);
Vue.component("delete-button", DeleteButton);

const component: Vue = new Vue({
    router,
    store,
    el: "#app",
    render: (h) => h(Entry)
});

const bootboxLocaleRFX = <BootboxLocaleValues> {
    OK : "Ок",
    CANCEL : "Отмена",
    CONFIRM : "Подтвердить"
};

bootbox.addLocale("ruRFX", bootboxLocaleRFX);
bootbox.setDefaults(<BootboxDefaultOptions> {
    locale: "ruRFX"
});

function checkAccess(to: RouteConfig, from: RouteConfig, next: (to?: string | object | false | ((vm: object) => any) | void) => void): any {
    if (!to.meta.auth || !to.meta.auth.required) {
        next();
        return;
    }
    const currentUser = ((store.state as any).common as ICommon).CurrentUser;
    const settings = ((store.state as any).common as ICommon).Settings;
    if (!currentUser.IsAuthenticated) {
        next("/Login");
        return;
    }

    if (to.meta.auth.superAdminOnly && currentUser.CompanyId) {
        next("/Login");
        return;
    }

    if (to.meta.auth.companyOnly && !currentUser.CompanyId) {
        next("/Login");
        return;
    }

    if (to.meta.restrictIfLimited) { // Ограниченная установка
        if (settings.IsLimited) {
            next("/Login");
            return;
        }
    }

    if (!to.meta.auth.roles || to.meta.auth.roles.length === 0) {
        next();
        return;
    }

    for (const role of to.meta.auth.roles) {
        if (isUserInRole(currentUser, role)) {
            next();
            return;
        }
    }
    next("/Login");
}

import Axios from "axios";
Axios.defaults.withCredentials = true;
