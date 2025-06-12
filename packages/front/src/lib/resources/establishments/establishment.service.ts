import type { SiretDto } from "dto";
import { toEstablishmentComponent } from "./establishment.adapter";
import establishmentPort from "./establishment.port";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import documentHelper from "$lib/helpers/document.helper";
import { getObjectWithMetadata, getValue } from "$lib/helpers/providerValueHelper";

class EstablishmentService {
    incExtractData(identifier) {
        establishmentPort.incExtractData(identifier);
    }

    async getBySiret(siret) {
        const establishment = await establishmentPort.getBySiret(siret);
        // TODO: think about another way to handle contacts (not as a ProviderValues)
        // When contacts is a ProviderValues, only the first element is returned and this is not the behavior we want for contacts
        const { contacts, ...rest } = establishment;
        return {
            ...toEstablishmentComponent(rest),
            contacts: contacts ? this.getContactsValue(contacts) : undefined,
        };
    }

    getContactsValue(contacts) {
        return contacts.map(contact => getValue(contact));
    }

    async getDocuments(identifier) {
        const result = await establishmentPort.getDocuments(identifier);

        if (!result) return [];

        const documents: DocumentEntity[] = result.map(document => getObjectWithMetadata(document));
        return documentHelper.formatAndSortDocuments(documents);
    }

    getGrantExtract(identifier: SiretDto) {
        return establishmentPort.getGrantExtract(identifier);
    }
}

const establishmentService = new EstablishmentService();

export default establishmentService;
