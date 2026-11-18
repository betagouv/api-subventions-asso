import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import { AssociationIdentifier, Rna, Siren } from "../../identifier-objects";
import { IdentifierError } from "../../domain/errors/IdentifierError";
import associationSearchAdapter, {
    AssociationSearchAdapter,
} from "../../adapters/outputs/db/association-search/association-search.adapter";
import { IdentifierNotHandledError } from "../../domain/errors/IdentifierNotHandledError";

export class GetAssociationIdentifiers implements AsyncUseCase<string, AssociationIdentifier[]> {
    constructor(private adapter: AssociationSearchAdapter) {}

    async execute(input: string) {
        const identifier = AssociationIdentifier.buildIdentifierFromString(input);
        if (!identifier) throw new IdentifierError(input);

        if (identifier instanceof Rna || identifier instanceof Siren) {
            const result = await this.adapter.findByIdentifier(identifier);

            // @TODO: should already be an array after #4121
            if (result?.rna && result?.siren) return [AssociationIdentifier.fromSirenAndRna(result.siren, result.rna)];
            else {
                if (identifier instanceof Rna) return [AssociationIdentifier.fromRna(identifier)];
                else return [AssociationIdentifier.fromSiren(identifier)];
            }
        } else throw new IdentifierNotHandledError(identifier);
    }
}

const getAssociationIdentifiers = new GetAssociationIdentifiers(associationSearchAdapter);
export default getAssociationIdentifiers;
