import type { SvelteComponent } from "svelte";
import Store from "$lib/core/Store";

export const modal: Store<boolean | typeof SvelteComponent> = new Store(false);
export const data: Record<string, any> = new Store({});
export const action: Store<(...args: any) => any> = new Store(() => null);
