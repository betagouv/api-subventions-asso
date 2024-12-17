import type { MainInfoBannerDto } from "dto";
import { SvelteComponent } from "svelte";
import localStorageService from "$lib/services/localStorage.service";
import configurationsService from "$lib/resources/configurations/configurations.service";
import Store from "$lib/core/Store";

const DEFAULT_TITLE = "";
const DEFAULT_DESCRIPTION =
    "Formez-vous en moins d'une heure à Data.subvention et gagnez un temps précieux au quotidien : <a href='https://datasubvention.beta.gouv.fr/webinaireformation-datasubvention/?mtm_campaign=webinaireformation&mtm_source=appli-bandeau' target='_blank' rel='noopener external' class='fr-notice__link' title='inscrivez-vous en cliquant ici - nouvelle fenêtre'>inscrivez-vous en cliquant ici</a>";

export class MainInfoBannerController {
    public mainInfoBanner: Store<MainInfoBannerDto>;

    constructor() {
        this.mainInfoBanner = new Store({ title: DEFAULT_TITLE, desc: DEFAULT_DESCRIPTION });
    }

    async init(): Promise<void> {
        const mainInfoBanner = await configurationsService.getMainInfoBanner();
        this.mainInfoBanner.set(mainInfoBanner);
    }

    public component: SvelteComponent | undefined;

    close() {
        localStorageService.setItem("hide-main-info-banner", "true");
        // defined by svelte with bind:this inside component
        (this.component as SvelteComponent).$destroy();
    }
}
