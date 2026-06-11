import { AssociationIdentifier, EstablishmentIdentifier } from "../../../identifier-objects";
import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";
import getAssociationApplications, { GetAssociationApplications } from "./get-association-applications";
import getEstablishmentApplications, { GetEstablishmentApplications } from "./get-establishment-applications";

export class GetApplications {
    constructor(
        private getEstabApplicatons: GetEstablishmentApplications,
        private getAssoApplications: GetAssociationApplications,
    ) {}

    execute(identifier: StructureIdentifier) {
        if (identifier instanceof EstablishmentIdentifier) return this.getEstabApplicatons.execute(identifier);
        else if (identifier instanceof AssociationIdentifier) return this.getAssoApplications.execute(identifier);
        else throw new Error("Wrong Structure Identifier");
    }
}

const getApplications = new GetApplications(getEstablishmentApplications, getAssociationApplications);
export default getApplications;
