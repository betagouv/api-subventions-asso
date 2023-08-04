import { createEventDispatcher } from "svelte";

export default class Dispatch {
    static getDispatcher = () => createEventDispatcher();
}
