import { toEstablishmentComponent } from "./establishment.adapter";
import establishmentPort from "./establishment.port";
import documentService from "@resources/documents/documents.service";
import { getObjectWithMetadata, getValue } from "@helpers/providerValueHelper";

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
        
        const documents = result.map(document => getObjectWithMetadata(document));
        return documentService.formatAndSortDocuments(documents);
    }
}

const establishmentService = new EstablishmentService();

export default establishmentService;
