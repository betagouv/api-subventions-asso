import type { SvelteComponent } from "svelte";
import localStorageService from "$lib/services/localStorage.service";

export class MainInfoBannerController {
    public startTitle = "Certaines informations de votre profil sont manquantes. N’oubliez pas de ";
    public endTitle = ".";
    public linkLabel = "compléter vos informations ici";
    public linkUrl = "/user/profile";
    public closeMsg = "Ne plus afficher ce message";
    public component: SvelteComponent | undefined;

    close() {
        localStorageService.setItem("hide-main-info-banner", "true");
        (this.component as SvelteComponent).$destroy();
    }
}
