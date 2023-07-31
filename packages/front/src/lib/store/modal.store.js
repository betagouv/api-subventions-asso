import { writable } from "svelte/store";
import Store from "$lib/core/Store";

export const modal = writable(false);
export const data = writable({});
export const action = new Store(() => null);
