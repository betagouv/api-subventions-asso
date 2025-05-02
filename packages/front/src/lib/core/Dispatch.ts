import { createEventDispatcher } from "svelte";

export default class Dispatch {
    static getDispatcher = <T>() => createEventDispatcher<Record<string, T>>();
}
