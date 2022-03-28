import AssociationController from "./association/interfaces/http/AssociationController";
import AuthController from "./auth/interfaces/http/AuthController";
import DownloadController from "./download/interfaces/http/DownloadController";
import EtablissementController from "./etablissement/interfaces/http/EtablissementController";
import HomeController from "./home/interfaces/http/HomeController";
import SearchController from "./search/interfaces/http/SearchController";
import LegalNoticeController from "./legal_notice/interface/http/LegalNoticeController";

export default [
    AuthController,
    AssociationController,
    DownloadController,
    EtablissementController,
    HomeController,
    SearchController,
    LegalNoticeController
]