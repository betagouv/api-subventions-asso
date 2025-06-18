import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import Siret from "../../identifierObjects/Siret";
import associationIdentifierService from "../association-identifier/association-identifier.service";

export class EstablishmentIdentifierService {
    async getEstablishmentIdentifiers(id: string): Promise<EstablishmentIdentifier> {
        if (Siret.isSiret(id)) {
            const siret = new Siret(id);
            // Dont use get one association identifier, because we dont know manage multiple rna identifiers
            const associationIdentifiers = await associationIdentifierService.getAssociationIdentifiers(
                siret.toSiren().value,
            );
            return EstablishmentIdentifier.fromSiret(new Siret(id), associationIdentifiers[0]);
        }

        throw new Error("Invalid identifier");
    }

    isEstablishmentIdentifier(id: string): boolean {
        return Siret.isSiret(id);
    }
}

const establishmentIdentifierService = new EstablishmentIdentifierService();

export default establishmentIdentifierService;
