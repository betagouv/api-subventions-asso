import { getSiegeSiret } from "../../views/association/association.helper";
import { valueOrHyphen } from "../../helpers/dataHelper";

export class StructureTitleController {
    constructor(association, siret = undefined) {
        const associationName = association.denomination_rna || association.denomination_siren;
        if (siret) {
            this.title =
                getSiegeSiret(association) === siret
                    ? "Établissement siège de l'association"
                    : "Établissement secondaire de l'association";
            this.subtitle = associationName;
            this.linkToAsso = `/association/${association.siren}`;
        } else this.title = `Association : ${associationName}`;
        this.rna = valueOrHyphen(association.rna);
        this.siren = valueOrHyphen(association.siren);
    }

    get hasActionButton() {
        return !!this.subtitle;
    }
}
