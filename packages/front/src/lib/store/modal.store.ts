import type { Component } from "svelte";
import Store from "$lib/core/Store";

export const modal = new Store<boolean | Component>(false);
export const data = new Store<unknown>({});
export const action: Store<(...args: unknown[]) => unknown> = new Store(() => null);
