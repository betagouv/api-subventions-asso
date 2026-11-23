import { MultipleAssociationsError, NotAssociationError } from "core";
import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import { AssociationIdentifier } from "../../identifier-objects";
import getAssociationIdentifiers, { GetAssociationIdentifiers } from "./get-association-identifiers";

/**
 * Legacy code that were translated into UseCase to fit the architecture
 * This should be looked in-depth to validate that it is still required
 */
export class GetOneAssociationIdentifier implements AsyncUseCase<string, AssociationIdentifier> {
    constructor(private getIdentifiers: GetAssociationIdentifiers) {}

    async execute(input: string) {
        const identifiers = await this.getIdentifiers.execute(input);
        if (identifiers.length > 1) {
            throw new MultipleAssociationsError();
        } else if (identifiers.length === 0) {
            throw new NotAssociationError();
        }

        return identifiers[0];
    }
}

const getOneAssociationIdentifier = new GetOneAssociationIdentifier(getAssociationIdentifiers);
export default getOneAssociationIdentifier;
