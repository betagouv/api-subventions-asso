import Association from "./views/association/Association.svelte";
import Etablissement from "./views/etablissement/Etablissement.svelte";
import AdminUsersAccount from "./views/admin/users/AdminUsersAccount.svelte";
import AdminUsersCreate from "./views/admin/users/AdminUsersCreate.svelte";
import Home from "./views/home/Home.svelte";
import AdminUsersMetrics from "./views/admin/users/AdminUsersMetrics.svelte";
import Admin from "./views/admin/Admin.svelte";
import AdminStats from "./views/admin/stats/AdminStats.svelte";
import ResetPwd from "./views/auth/reset-pwd/ResetPwd.svelte";
import ForgetPwd from "./views/auth/forget-pwd/ForgetPwd.svelte";
import Signup from "./views/auth/signup/Signup.svelte";
import Login from "./views/auth/login/Login.svelte";

export default {
    "association/:id": {
        component: () => Association,
        needAuthentification: true
    },
    "etablissement/:id": {
        component: () => Etablissement,
        needAuthentification: true
    },
    "admin/users/list": {
        component: () => AdminUsersAccount,
        needAuthentification: true
    },
    "admin/users/create": {
        component: () => AdminUsersCreate,
        needAuthentification: true
    },
    "admin/users/metrics": {
        component: () => AdminUsersMetrics,
        needAuthentification: true
    },
    "admin/stats": {
        component: () => AdminStats,
        needAuthentification: true
    },
    admin: {
        component: () => Admin,
        needAuthentification: true
    },
    "/": {
        component: () => Home,
        needAuthentification: true
    },
    "auth/signup": {
        component: () => Signup,
        needAuthentification: false
    },
    "auth/login": {
        component: () => Login,
        needAuthentification: false
    },
    "auth/reset-password/:token": {
        component: () => ResetPwd,
        disableAuth: true
    },
    "auth/forget-password": {
        component: () => ForgetPwd,
        disableAuth: true
    }
};
