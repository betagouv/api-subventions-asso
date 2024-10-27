import { isAssociation } from "$lib/resources/associations/association.helper";
import associationService from "$lib/resources/associations/association.service";
import { currentAssoSimplifiedEtabs, currentAssociation, currentIdentifiers } from "$lib/store/association.store";
import { siretToSiren } from "$lib/helpers/sirenHelper";
import establishmentService from "$lib/resources/establishments/establishment.service";
import rnaSirenService from "$lib/resources/open-source/rna-siren/rna-siren.service";

export class EstablishmentController {
    titles = ["Subventions", "Contacts", "Pièces administratives", "Informations bancaires"];
    promises: Promise<{ establishment: any }>;

    constructor(id: string) {
        this.promises = this.init(id);
    }

    async init(id: string) {
        let associationUniqueIdentifier = siretToSiren(id);

        const associationIdentifiers = await rnaSirenService.getAssociatedIdentifier(siretToSiren(id));
        if (associationIdentifiers.length > 1) {
            // Usecase : multiple rna identifiers, old rules select the first one. Waiting to do better.
            associationUniqueIdentifier = associationIdentifiers[0].rna;
        }

        currentIdentifiers.set(associationIdentifiers);

        const associationPromise = associationService.getAssociation(associationUniqueIdentifier).then(asso => {
            currentAssociation.set(asso);
            return asso;
        });

        const simplifiedEstablishmentPromise = associationService
            .getEstablishments(associationUniqueIdentifier)
            .then(estabs => currentAssoSimplifiedEtabs.set(estabs));

        const establishmentPromise = establishmentService.getBySiret(id);

        return Promise.all([associationPromise, establishmentPromise, simplifiedEstablishmentPromise]).then(result => ({
            association: result[0],
            establishment: result[1],
        }));
    }

    get isAssociation() {
        return isAssociation(currentAssociation.value);
    }
}
