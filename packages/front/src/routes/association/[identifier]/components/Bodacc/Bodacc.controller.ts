import crispService from "$lib/services/crisp.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper.js";
import type { BodaccRecord } from "dto";

export default class BodaccController {
    constructor(public announcements: BodaccRecord[]) {}

    onMount(element) {
        waitElementIsVisible(element).then(() => crispService.seenBodacc());
    }
}
