import type { MainInfoBannerDto } from "dto";
import { SvelteComponent } from "svelte";
import localStorageService from "$lib/services/localStorage.service";
import configurationsService from "$lib/resources/configurations/configurations.service";
import Store from "$lib/core/Store";

export class MainInfoBannerController {
    public mainInfoBanner: Store<MainInfoBannerDto>;

    constructor() {
        this.mainInfoBanner = new Store({ title: "", desc: "" });
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
