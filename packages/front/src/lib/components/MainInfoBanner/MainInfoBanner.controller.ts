import type { SvelteComponent } from "svelte";
import localStorageService from "$lib/services/localStorage.service";

export class MainInfoBannerController {
    public linkUrl =
        "https://datasubvention.beta.gouv.fr/consultation-agents-publics-donnees-subventions-2024/?mtm_campaign=consultationdonnees&mtm_source=bandeauapp"; // "/user/profile";  // TODO clean in #2544
    public component: SvelteComponent | undefined;

    get title() {
        // return `Certaines informations de votre profil sont manquantes. N’oubliez pas de <a href=${this.linkUrl}>compléter vos informations ici</a>.`; // TODO clean in #2544
        return `CONSULTATION - Agents publics, partagez vos attentes et besoins métiers en matière d’informations sur les subventions des associations : <a href="${this.linkUrl}">participez à l'enquête</a>`;
    }

    close() {
        localStorageService.setItem("hide-main-info-banner", "true");
        // defined by svelte with bind:this inside component
        (this.component as SvelteComponent).$destroy();
    }
}
