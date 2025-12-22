import { setContext } from "svelte";
import AppContext from "./AppContext";
import trackerService from "$lib/services/tracker.service";
import { PUBLIC_ENV } from "$env/static/public";
import localStorageService from "$lib/services/localStorage.service";
import { page } from "$app/stores";
import Store, { derived } from "$lib/core/Store";
import { connectedUser } from "$lib/store/user.store";
import errorService from "$lib/services/error.service";

export class AppController {
    element: HTMLElement | undefined = undefined;
    displayBanner = new Store(false);
    constructor() {
        trackerService.init(PUBLIC_ENV);
        this.initContext();

        // trick to subscribe two stores because we need page AND connectedUser to be defined before running script
        const multipleSubscribes = derived([page, connectedUser], ([$page, $connectedUser]) => {
            return [$page, $connectedUser];
        });

        multipleSubscribes.subscribe(([$page, $connectedUser]) => {
            // the first trigger will have one of the two store null so we check for it before executing required script
            if ($page && $connectedUser) {
                this.handleBannerDisplay();
            }
        });
    }

    initContext() {
        setContext("app", AppContext);
    }

    async handleBannerDisplay() {
        const localStorageHide = localStorageService.getItem("hide-main-info-banner", false);
        if (localStorageHide.value) return this.displayBanner.set(false);
        this.displayBanner.set(true);
    }

    public setupGlobalEventListeners(): () => void {
        const handleButtonClick = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target?.tagName === "BUTTON") {
                errorService.clearError();
            }
        };

        document.addEventListener("click", handleButtonClick);

        return () => {
            document.removeEventListener("click", handleButtonClick);
        };
    }
}
