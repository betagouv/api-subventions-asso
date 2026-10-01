import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import associationSearchAdapter from "../../adapters/outputs/db/association-search/association-search.adapter";
import { AssociationSearchPort } from "../../adapters/outputs/db/association-search/association-search.port";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";
import { AssociationIdentifier, EstablishmentIdentifier, Rna, Siren, Siret } from "../../identifier-objects";

export interface SearchInput {
    value: string;
    postalCode?: string;
}

export class Search implements AsyncUseCase<SearchInput, AssociationSearchEntity[]> {
    constructor(private searchPort: AssociationSearchPort) {}

    async execute(args: SearchInput) {
        let results: AssociationSearchEntity[] = [];

        let identifier =
            AssociationIdentifier.buildIdentifierFromString(args.value) ??
            EstablishmentIdentifier.buildIdentifierFromString(args.value);

        if (identifier instanceof Siret) identifier = identifier.toSiren();

        if (identifier instanceof Siren || identifier instanceof Rna) {
            // search by identifier
            const entity = await this.searchPort.findByIdentifier(identifier, args.postalCode);
            if (entity) results = [entity];
        } else if (!identifier) {
            // search by name/object
            results = await this.searchPort.findByText(args.value, args.postalCode);
        } else {
            // other identifiers are not handled yet
            // silently fails
            results = [];
        }

        return results;
    }
}

const search = new Search(associationSearchAdapter);
export default search;
