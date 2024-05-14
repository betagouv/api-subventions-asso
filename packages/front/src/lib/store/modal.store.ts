import type { ComponentType } from "svelte";
import Store from "$lib/core/Store";

export const modal = new Store<boolean | ComponentType>(false);
export const data = new Store<unknown>({});
export const action: Store<(...args: unknown[]) => unknown> = new Store(() => null);
