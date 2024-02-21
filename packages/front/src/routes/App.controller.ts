import type { Page } from "@sveltejs/kit";
import { setContext } from "svelte";
import trackerService from "$lib/services/tracker.service";
import { ENV } from "$env/static/public";
import localStorageService from "$lib/services/localStorage.service";
import { page } from "$app/stores";
import Store from "$lib/core/Store";
export class AppController {
    page: Page | undefined;
    displayBanner = new Store(true);
    constructor() {
        trackerService.init(ENV);
        this.initContext();
        page.subscribe(newPage => {
            this.page = newPage;
            this.handleBannerDisplay(newPage.url.pathname);
        });
    }

    initContext() {
        setContext("app", {
            getEnv: () => ENV,
            getName: () => "Data.Subvention",
            getDescription: () => "Les dernières informations sur les associations et leurs subventions",
            getContact: () => "contact@datasubvention.beta.gouv.fr",
            getRepo: () => "https://github.com/betagouv/api-subventions-asso",
        });
    }

    handleBannerDisplay(url: string) {
        if (url === "/user/profile") {
            this.displayBanner.set(false);
            return;
        }
        this.displayBanner.set(!localStorageService.getItem("hide-main-info-banner", false).value);
    }
}
