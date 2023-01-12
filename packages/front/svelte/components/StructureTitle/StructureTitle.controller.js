import { getSiegeSiret } from "../../views/association/association.helper";

export class StructureTitleController {
    constructor(association, etablissementId = undefined) {
        const associationName = association.denomination_rna || association.denomination_siren;
        if (etablissementId) {
            this.title =
                getSiegeSiret(association) === etablissementId
                    ? "Établissement siège de l'association"
                    : "Établissement secondaire de l'association";
            this.subtitle = associationName;
        } else this.title = `Association : ${associationName}`;
        this.rna = association.rna;
        this.siren = association.siren;
    }

    get hasSubtitle() {
        return !!this.subtitle;
    }

    get hasActionButton() {
        return !!this.subtitle;
    }
}
