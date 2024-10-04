import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import Rna from "../../valueObjects/Rna";
import Siren from "../../valueObjects/Siren";
import Siret from "../../valueObjects/Siret";
import rnaSirenService from "../rna-siren/rnaSiren.service";

export class AssociationIdentifierService {
    async getAssociationIdentifiers(id: string): Promise<AssociationIdentifier[]> {
        const associationIdentifier = this.identifierStringToEntity(id);

        const rnaSirenEntities = await rnaSirenService.find(associationIdentifier);

        if (!rnaSirenEntities || rnaSirenEntities?.length === 0) {
            return [AssociationIdentifier.fromId(associationIdentifier)];
        }

        return rnaSirenEntities.map(rnaSirenEntity =>
            AssociationIdentifier.fromSirenAndRna(rnaSirenEntity.siren, rnaSirenEntity.rna),
        );
    }

    async getOneAssociationIdentifier(id: string): Promise<AssociationIdentifier> {
        const identifiers = await this.getAssociationIdentifiers(id);

        if (identifiers.length > 1) {
            throw new Error("Multiple associations found with this identifier, please use a more specific one.");
        } else if (identifiers.length === 0) {
            throw new Error("No association found with this identifier");
        }

        return identifiers[0];
    }

    identifierStringToEntity(id: string): Rna | Siren {
        if (Rna.isRna(id)) {
            return new Rna(id);
        } else if (Siren.isSiren(id)) {
            return new Siren(id);
        } else if (Siret.isSiret(id)) {
            return new Siret(id).toSiren();
        }

        throw new Error("Invalid identifier");
    }
}

const associationIdentifierService = new AssociationIdentifierService();
export default associationIdentifierService;
