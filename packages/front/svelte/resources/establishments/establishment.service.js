import { toEstablishmentComponent } from "./establishment.adapter";
import establishmentPort from "./establishment.port";
import { getValue } from "@helpers/providerValueHelper";

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

    getDocuments(siret) {
        return establishmentPort.getDocuments(siret);
    }
}

const establishmentService = new EstablishmentService();

export default establishmentService;
