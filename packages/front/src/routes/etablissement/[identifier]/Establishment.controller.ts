import { isAssociation } from "$lib/resources/associations/association.helper";
import associationService from "$lib/resources/associations/association.service";
import { currentAssoSimplifiedEtabs, currentAssociation } from "$lib/store/association.store";
import { siretToSiren } from "$lib/helpers/sirenHelper";
import establishmentService from "$lib/resources/establishments/establishment.service";

export class EstablishmentController {
    titles = ["Subventions", "Contacts", "Pièces administratives", "Informations bancaires"];
    promises: Promise<{ establishment: any }>;

    constructor(id: string) {
        const associationPromise = associationService.getAssociation(siretToSiren(id)).then(asso => {
            currentAssociation.set(asso);
            return asso;
        });
        const simplifiedEstablishmentPromise = associationService
            .getEstablishments(siretToSiren(id))
            .then(estabs => currentAssoSimplifiedEtabs.set(estabs));
        const establishmentPromise = establishmentService.getBySiret(id);

        this.promises = Promise.all([associationPromise, establishmentPromise, simplifiedEstablishmentPromise]).then(
            result => ({
                association: result[0],
                establishment: result[1],
            }),
        );
    }

    get isAssociation() {
        return isAssociation(currentAssociation.value);
    }
}
