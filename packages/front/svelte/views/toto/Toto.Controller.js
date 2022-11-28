import { writable } from "svelte/store";
import blaguesService from "../../resources/blagues/blagues.service";

export class TotoController {
    constructor(tutu) {
        this.blagues = writable([tutu]);

        blaguesService.getBlagues().then(data => {
            this.blagues.update(oldData => oldData.concat([data]));
        });
    }

    click() {
        console.log("Je fait des truc");
    }
}
