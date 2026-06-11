import { AssociationIdentifier, EstablishmentIdentifier } from "../../../identifier-objects";
import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";
import getAssociationPayments, { GetAssociationPayments } from "./get-association-payments";
import getEstablishmentPayments, { GetEstablishmentPayments } from "./get-establishment-payments";

export class GetPayments {
    constructor(
        private getBySiren: GetAssociationPayments,
        private getBySiret: GetEstablishmentPayments,
    ) {}

    execute(identifier: StructureIdentifier) {
        if (identifier instanceof EstablishmentIdentifier) return this.getBySiret.execute(identifier);
        else if (identifier instanceof AssociationIdentifier) return this.getBySiren.execute(identifier);
        else throw new Error("Wrong Structure Identifier");
    }
}

const getPayments = new GetPayments(getAssociationPayments, getEstablishmentPayments);
export default getPayments;
