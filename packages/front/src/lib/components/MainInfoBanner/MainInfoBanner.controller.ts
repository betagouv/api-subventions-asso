import type { SvelteComponent } from "svelte";
import localStorageService from "$lib/services/localStorage.service";

export class MainInfoBannerController {
    private linkUrl =
        "https://datasubvention.beta.gouv.fr/webinaireformation-datasubvention/?mtm_campaign=webinaireformation&mtm_source=appli-bandeau";
    // private link = "/user/profile";  // TODO clean in #2544
    public component: SvelteComponent | undefined;

    get title() {
        return "";
    }

    get description() {
        // return `Certaines informations de votre profil sont manquantes. N’oubliez pas de`; // TODO clean in #2544
        return "Formez-vous en moins d'une heure à Data.subvention et gagnez un temps précieux au quotidien : ";
    }

    get url() {
        return this.linkUrl;
    }

    get urlLabel() {
        //  return "compléter vos informations ici"  // TODO clean in #2544
        return "inscrivez-vous en cliquant ici";
    }

    close() {
        localStorageService.setItem("hide-main-info-banner", "true");
        // defined by svelte with bind:this inside component
        (this.component as SvelteComponent).$destroy();
    }
}
