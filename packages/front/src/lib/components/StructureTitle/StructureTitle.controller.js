import { getSiegeSiret } from "$lib/resources/associations/association.helper";
import { valueOrHyphen } from "$lib/helpers/dataHelper";
import { getUniqueIdentifier } from "$lib/helpers/identifierHelper";

export class StructureTitleController {
    constructor(association, siret = undefined, identifiers = []) {
        const associationName = association.denomination_rna || association.denomination_siren;
        if (siret) {
            this.title =
                getSiegeSiret(association) === siret
                    ? "Établissement siège de l'association"
                    : "Établissement secondaire de l'association";
            this.subtitle = associationName;

            const uniqueIdentifier = getUniqueIdentifier(identifiers);
            this.linkToAsso = `/association/${uniqueIdentifier}`;
        } else this.title = `Association : ${associationName}`;
        this.rna = valueOrHyphen(association.rna);
        this.siren = valueOrHyphen(association.siren);
        this.rup = Boolean(association.rup);
        this.nbEstabs = association.etablisements_siret ? association.etablisements_siret.length : 1;
    }

    get hasActionButton() {
        return !!this.subtitle;
    }

    get nbEstabLabel() {
        // duplicate from AssociationCard but I don't think it is worth making an helper for this
        return this.nbEstabs <= 1
            ? `${this.nbEstabs} établissement rattaché`
            : `${this.nbEstabs} établissements rattachés`;
    }
}
