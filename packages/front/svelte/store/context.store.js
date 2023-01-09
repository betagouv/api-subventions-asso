import { writable } from "svelte/store";

export const displayBlueBanner = writable(false);

export const toggleBlueBanner = () => {
    displayBlueBanner.set(() => true);
};
