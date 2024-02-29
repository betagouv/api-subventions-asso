import type { SvelteComponent } from "svelte";
import localStorageService from "$lib/services/localStorage.service";

export class MainInfoBannerController {
    public linkUrl = "/user/profile";
    public component: SvelteComponent | undefined;

    get title() {
        return `Certaines informations de votre profil sont manquantes. N’oubliez pas de <a href=${this.linkUrl}>compléter vos informations ici</a>.`;
    }

    close() {
        localStorageService.setItem("hide-main-info-banner", "true");
        // defined by svelte with bind:this inside component
        (this.component as SvelteComponent).$destroy();
    }
}
