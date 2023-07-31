import { writable, derived } from "svelte/store";

export const path = writable(window.location.pathname);

export const segments = derived(path, $path => $path.split("/"));
