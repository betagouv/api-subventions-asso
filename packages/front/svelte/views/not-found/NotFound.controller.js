import { getContext } from "svelte";

export default class NotFoundController {
    constructor() {
        this.app = getContext("app");
    }

    get contactEmail() {
        return this.app.getContact();
    }
}
