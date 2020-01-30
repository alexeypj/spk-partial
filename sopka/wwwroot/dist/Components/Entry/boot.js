import Vue from "vue";
import Entry from "./Entry.vue";
import VueRouter from "vue-router";
import { store } from "../../Store/index";
import { Roles } from "../../Store/Modules/Common/types";
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
import VeeValidate, { Validator } from "vee-validate";
import RuLocalization from "vee-validate/dist/locale/ru.js";
const phoneNumber = {
    getMessage(field) {
        return "Введите действительный телефонный номер";
    },
    validate(value) {
        const reg = new RegExp("^\\+?[0-9\(\)\\s\\.\\w\\-\u0430-\u044f]+$");
        return reg.test(value);
    }
};
Validator.extend("phoneNumber", phoneNumber);
Validator.localize("ru", RuLocalization);
const validatorConfig = { locale: "ru", fieldsBagName: "formFields" };
Vue.use(VeeValidate, validatorConfig);
Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "",
            component: MainPage,
            meta: {
                auth: {
                    required: true,
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
            props: true,
            meta: { auth: { required: true } }
        },
        {
            path: "/Users",
            component: User,
            props: true,
            meta: { auth: { required: true, roles: [Roles.Admin] } }
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
            meta: { auth: { required: true } }
        },
        {
            path: "/Login",
            component: Login
        },
        {
            path: "/Login/ResetPassword",
            component: ResetPassword
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
                    roles: [Roles.Admin]
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
                }
            }
        },
        {
            path: "/EquipmentJournals",
            component: EquipmentJournals,
            props: true,
            meta: {
                auth: {
                    required: true
                }
            }
        }
    ]
});
router.beforeEach(checkAccess);
const component = new Vue({
    router,
    store,
    el: "#app",
    render: (h) => h(Entry)
});
const bootboxLocaleRFX = {
    OK: "Ок",
    CANCEL: "Отмена",
    CONFIRM: "Подтвердить"
};
bootbox.addLocale("ruRFX", bootboxLocaleRFX);
bootbox.setDefaults({
    locale: "ruRFX"
});
function checkAccess(to, from, next) {
    if (!to.meta.auth || !to.meta.auth.required) {
        next();
        return;
    }
    let currentUser = store.state.common.CurrentUser;
    if (!currentUser.IsAuthenticated) {
        next("/Login");
        return;
    }
    if (!to.meta.auth.roles || to.meta.auth.roles.length === 0) {
        next();
        return;
    }
    for (let role of to.meta.auth.roles) {
        if (isUserInRole(currentUser, role)) {
            next();
            return;
        }
    }
    next("/Login");
}
//# sourceMappingURL=boot.js.map