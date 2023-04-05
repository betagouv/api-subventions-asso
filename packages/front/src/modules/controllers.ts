import AssociationController from "./association/interfaces/http/AssociationController";
import AuthController from "./auth/interfaces/http/AuthController";
import EtablissementController from "./etablissement/interfaces/http/EtablissementController";
import HomeController from "./home/interfaces/http/HomeController";
import LegalNoticeController from "./legal_notice/interface/http/LegalNoticeController";
import CGUController from "./cgu/interface/http/CGUController";
import ContactController from "./contact/interface/http/ContactController";
import AdminController from "./admin/interfaces/http/AdminController";
import SvelteController from "./svelte-example/SvelteController";
import NotFoundController from "./404Controller";

export default [
    AuthController,
    AssociationController,
    EtablissementController,
    HomeController,
    LegalNoticeController,
    ContactController,
    AdminController,
    CGUController,
    SvelteController,
    NotFoundController,
];
