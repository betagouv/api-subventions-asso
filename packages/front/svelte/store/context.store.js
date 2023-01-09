import { writable } from "svelte/store";

export const displayBlueBanner = writable(false);

export const activeBlueBanner = () => {
    displayBlueBanner.set(() => true);
};
