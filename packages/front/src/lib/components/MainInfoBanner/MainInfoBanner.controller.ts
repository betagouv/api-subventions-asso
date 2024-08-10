import type { SvelteComponent } from "svelte";
import localStorageService from "$lib/services/localStorage.service";

export class MainInfoBannerController {
    private linkUrl =
        "https://datasubvention.beta.gouv.fr/consultation-agents-publics-donnees-subventions-2024/?mtm_campaign=consultationdonnees&mtm_source=bandeauapp";
    // private link = "/user/profile";  // TODO clean in #2544
    public component: SvelteComponent | undefined;

    get title() {
        return "CONSULTATION";
    }

    get description() {
        // return `Certaines informations de votre profil sont manquantes. N’oubliez pas de`; // TODO clean in #2544
        return "Agents publics, partagez vos attentes et besoins métiers en matière d’informations sur les subventions des associations :";
    }

    get url() {
        //  return "compléter vos informations ici"  // TODO clean in #2544
        return this.linkUrl;
    }

    close() {
        localStorageService.setItem("hide-main-info-banner", "true");
        // defined by svelte with bind:this inside component
        (this.component as SvelteComponent).$destroy();
    }
}
