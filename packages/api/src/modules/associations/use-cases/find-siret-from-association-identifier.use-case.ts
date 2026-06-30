import { AssociationIdType } from "../../../identifier-objects/@types/IdentifierType";
import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";
import findSiretFromRna, { FindSiretFromRnaUseCase } from "./find-siret-from-rna.use-case";
import findSiretFromSiren, { FindSiretFromSirenUseCase } from "./find-siret-from-siren.use-case";

export class FindSiretFromAssociationIdentifierUseCase {
    constructor(
        private findFromRna: FindSiretFromRnaUseCase,
        private findFromSiren: FindSiretFromSirenUseCase,
    ) {}

    execute(identifier: AssociationIdType) {
        if (identifier instanceof Rna) return this.findFromRna.execute(identifier);
        if (identifier instanceof Siren) return this.findFromSiren.execute(identifier);
        throw new Error("Invalid Association Identifier");
    }
}

const findSiretFromAssoIdentifier = new FindSiretFromAssociationIdentifierUseCase(findSiretFromRna, findSiretFromSiren);
export default findSiretFromAssoIdentifier;
