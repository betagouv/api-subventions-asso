import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import Siret from "../../identifier-objects/Siret";
import getAssociationIdentifiers, {
    GetAssociationIdentifiers,
} from "../../usecases/association/get-association-identifiers";

export class EstablishmentIdentifierService {
    constructor(private getIdentifiers: GetAssociationIdentifiers) {}

    async getEstablishmentIdentifiers(id: string): Promise<EstablishmentIdentifier> {
        if (Siret.isSiret(id)) {
            const siret = new Siret(id);
            // Dont use get one association identifier, because we dont know manage multiple rna identifiers
            const associationIdentifiers = await this.getIdentifiers.execute(siret.toSiren().value);
            return EstablishmentIdentifier.fromSiret(new Siret(id), associationIdentifiers[0]);
        }

        throw new Error("Invalid identifier");
    }

    isEstablishmentIdentifier(id: string): boolean {
        return Siret.isSiret(id);
    }
}

const establishmentIdentifierService = new EstablishmentIdentifierService(getAssociationIdentifiers);

export default establishmentIdentifierService;
