import HtmlSanitizer from "jitbit-html-sanitizer";
import { isStartOfSiret } from "$lib/helpers/validatorHelper";
import { siretToSiren } from "$lib/helpers/sirenHelper";
import trackerService from "$lib/services/tracker.service";

export class ResultCardController {
    public url: string;
    public htmlName: string;
    public htmlRna: string;
    public htmlSiren: string;

    constructor(association, rawSearchValue: string) {
        const name = association.name || "-";
        const rna = association.rna || "INCONNU";
        const siren = association.siren || "INCONNU";
        this.url = `/association/${association.rna || association.siren}`;

        let searchValue = HtmlSanitizer.SanitizeHtml(rawSearchValue.trim());
        if (isStartOfSiret(rawSearchValue)) {
            searchValue = siretToSiren(rawSearchValue);
        }

        const searchValueRegex = new RegExp(searchValue, "ig");
        const upperSearchedValue = searchValue.toUpperCase();

        this.htmlName = name.replace(searchValueRegex, `<span class="dsfr-black-bold">${upperSearchedValue}</span>`);
        this.htmlRna = rna.replace(searchValueRegex, `<span class="dsfr-black-bold">${upperSearchedValue}</span>`);
        this.htmlSiren = siren.replace(searchValueRegex, `<span class="dsfr-black-bold">${upperSearchedValue}</span>`);
    }
}
