import { MultipleAssociationsError } from "core";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import Rna from "../../identifierObjects/Rna";
import Siren from "../../identifierObjects/Siren";
import Siret from "../../identifierObjects/Siret";
import { IdentifierError } from "./IdentifierError";
import rnaSirenService from "../rna-siren/rna-siren.service";
import rechercheEntreprisesService from "../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.service";
import { AssociationIdType } from "../../identifierObjects/@types/IdentifierType";

export class AssociationIdentifierService {
    async findFromRechercheEntreprises(identifier: AssociationIdType) {
        const reResult = await rechercheEntreprisesService.getSearchResult(identifier.value);
        if (reResult.length === 0) return [AssociationIdentifier.fromId(identifier)];
        if (identifier.name === Siren.getName())
            return reResult
                .filter(entity => entity.rna)
                .map(entity => AssociationIdentifier.fromSirenAndRna(identifier, entity.rna!));
        else return reResult.map(entity => AssociationIdentifier.fromSirenAndRna(entity.siren, identifier));
    }

    async getAssociationIdentifiers(id: string): Promise<AssociationIdentifier[]> {
        const associationIdentifier = this.identifierStringToEntity(id);

        const rnaSirenEntities = await rnaSirenService.find(associationIdentifier);
        if (!rnaSirenEntities || rnaSirenEntities?.length === 0) {
            const reResults = await this.findFromRechercheEntreprises(associationIdentifier);
            rnaSirenService.insertManyAssociationIdentifer(reResults);
            return reResults;
        }

        return rnaSirenEntities.map(rnaSirenEntity =>
            AssociationIdentifier.fromSirenAndRna(rnaSirenEntity.siren, rnaSirenEntity.rna),
        );
    }

    async getOneAssociationIdentifier(id: string): Promise<AssociationIdentifier> {
        const identifiers = await this.getAssociationIdentifiers(id);

        if (identifiers.length > 1) {
            throw new MultipleAssociationsError();
        } else if (identifiers.length === 0) {
            throw new Error("No association found with this identifier");
        }

        return identifiers[0];
    }

    identifierStringToEntity(id: string): AssociationIdType {
        if (Rna.isRna(id)) {
            return new Rna(id);
        } else if (Siren.isSiren(id)) {
            return new Siren(id);
        } else if (Siret.isSiret(id)) {
            return new Siret(id).toSiren();
        }

        throw new IdentifierError(id);
    }
}

const associationIdentifierService = new AssociationIdentifierService();
export default associationIdentifierService;
