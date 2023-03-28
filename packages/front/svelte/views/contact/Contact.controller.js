import { getContext } from "svelte";

export default class ContactController {
    constructor() {
        this.app = getContext("app");
    }

    get contactEmail() {
        return this.app.getContact();
    }
}
