import { isAssociation } from "$lib/resources/associations/association.helper";
import associationService from "$lib/resources/associations/association.service";
import { currentAssoSimplifiedEtabs, currentAssociation, currentIdentifiers } from "$lib/store/association.store";
import { siretToSiren } from "$lib/helpers/identifierHelper";
import establishmentService from "$lib/resources/establishments/establishment.service";
import rnaSirenService from "$lib/resources/open-source/rna-siren/rna-siren.service";
import type { RnaSirenResponseDto } from "dto";

export class EstablishmentController {
    titles = ["Subventions", "Contacts", "Pièces administratives", "Informations bancaires"];
    promises: Promise<{ establishment: unknown }>;

    constructor(id: string) {
        this.promises = this.init(id);
    }

    async init(siret: string) {
        const siren = siretToSiren(siret);

        const rnaSirenMatches = await rnaSirenService.getAssociatedIdentifier(siren);

        let identifierToUse = siren;
        let identifiers: RnaSirenResponseDto[];
        if (!rnaSirenMatches) {
            identifiers = [{ siren, rna: null }];
        } else {
            identifiers = rnaSirenMatches;
            // we value rna more than siren to retrieve informations
            identifierToUse = identifiers[0].rna;
        }

        currentIdentifiers.set(identifiers);

        const associationPromise = associationService.getAssociation(identifierToUse).then(asso => {
            currentAssociation.set(asso);
            return asso;
        });

        const establishmentPromise = establishmentService.getBySiret(siret);

        return Promise.all([associationPromise, establishmentPromise]).then(result => {
            // mimic the association view postal code calculation for the application side
            // even if on establishment view we only have one postal code
            currentAssoSimplifiedEtabs.set([result[1]]);
            return {
                association: result[0],
                establishment: result[1],
            };
        });
    }

    get isAssociation() {
        return isAssociation(currentAssociation.value);
    }
}
