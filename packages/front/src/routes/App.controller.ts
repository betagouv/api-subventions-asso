import type { Page } from "@sveltejs/kit";
import type { UserDto } from "dto";
import { setContext } from "svelte";
import AppContext from "./AppContext";
import trackerService from "$lib/services/tracker.service";
import { ENV } from "$env/static/public";
import localStorageService from "$lib/services/localStorage.service";
import { page } from "$app/stores";
import Store, { derived } from "$lib/core/Store";
import userService from "$lib/resources/users/user.service";
import { connectedUser } from "$lib/store/user.store";

export class AppController {
    element: HTMLElement | undefined = undefined;
    displayBanner = new Store(false);
    constructor() {
        trackerService.init(ENV);
        this.initContext();

        // trick to subscribe two stores because we need page AND connectedUser to be defined before running script
        const multipleSubscribes = derived([page, connectedUser], ([$page, $connectedUser]) => {
            return [$page, $connectedUser];
        });

        multipleSubscribes.subscribe(([$page, $connectedUser]) => {
            // the first trigger will have one of the two store null so we check for it before executing required script
            if ($page && $connectedUser) {
                this.handleBannerDisplay(($page as Page).url.pathname, $connectedUser as UserDto);
            }
        });
    }

    initContext() {
        setContext("app", AppContext);
    }

    async handleBannerDisplay(url: string, user: UserDto) {
        // if (["/user/profile", "/auth/login", "/auth/signup"].includes(url)) return this.displayBanner.set(false); // TODO clean in #2544
        const localStorageHide = localStorageService.getItem("hide-main-info-banner", false);
        if (localStorageHide.value) return this.displayBanner.set(false);
        // if (userService.isProfileFullyCompleted(user)) { // TODO clean in #2544
        //     return this.displayBanner.set(false);
        // }
        this.displayBanner.set(true);
    }
}
