import type { SvelteComponent } from "svelte";
import Store from "$lib/core/Store";

export const modal = new Store<boolean | typeof SvelteComponent>(false);
export const data = new Store<unknown>({});
export const action: Store<(...args: unknown[]) => unknown> = new Store(() => null);
