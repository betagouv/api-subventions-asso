import crispService from "$lib/services/crisp.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper.js";

export default class BodaccController {
    constructor(bodacc) {
        this.bodacc = bodacc;
    }

    onMount(element) {
        waitElementIsVisible(element).then(() => crispService.seenBodacc());
    }

    get announcements() {
        return this.bodacc?.map(announcement => announcement.fields);
    }
}
