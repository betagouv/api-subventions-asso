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
import NotFound from "./views/not-found/NotFound.svelte";
import LegalNotice from "./views/LegalNotice.svelte";
import Cgu from "./views/Cgu.svelte";
import Contact from "./views/Contact.svelte";
import Profile from "./views/user/profile/Profile.svelte";
import SignupForm from "./views/auth/signup/SignupForm.svelte";

export default {
    "/404": {
        component: () => NotFound,
        disableAuth: true,
    },
    "association/:id": {
        component: () => Association,
    },
    "etablissement/:id": {
        component: () => Etablissement,
    },
    "admin/users/list": {
        component: () => AdminUsersAccount,
    },
    "admin/users/create": {
        component: () => AdminUsersCreate,
    },
    "admin/users/metrics": {
        component: () => AdminUsersMetrics,
    },
    "admin/stats": {
        component: () => AdminStats,
    },
    admin: {
        component: () => Admin,
    },
    "/": {
        component: () => Home,
    },
    "mentions-legales": {
        component: () => LegalNotice,
        disableAuth: true,
    },
    cgu: {
        component: () => Cgu,
        disableAuth: true,
    },
    contact: {
        component: () => Contact,
        disableAuth: true,
    },
    "auth/signup": {
        component: () => Signup,
        disableAuth: true,
    },
    "auth/signup-form/:token": {
        // route path to improve
        component: () => SignupForm,
        disableAuth: true,
    },
    "auth/login": {
        component: () => Login,
        disableAuth: true,
    },
    "auth/reset-password/:token": {
        component: () => ResetPwd,
        disableAuth: true,
    },
    "auth/forget-password": {
        component: () => ForgetPwd,
        disableAuth: true,
    },
    "user/profile": {
        component: () => Profile,
    },
};
