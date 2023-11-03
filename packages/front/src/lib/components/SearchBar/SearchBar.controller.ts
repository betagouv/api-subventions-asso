import Dispatch from "$lib/core/Dispatch";

export class SearchBarController {
    public dispatch;
    constructor() {
        this.dispatch = Dispatch.getDispatcher();
    }

    dispatchSubmit() {
        console.log("dispatchSubmit");
        this.dispatch("submit");
    }
}
