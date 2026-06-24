import applicationFlatAdapter from "../../../adapters/outputs/db/application-flat/application-flat.adapter";
import { ApplicationFlatPort } from "../../../adapters/outputs/db/application-flat/application-flat.port";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import { AssociationIdentifier } from "../../../identifier-objects";

export class GetAssociationApplications {
    constructor(private port: ApplicationFlatPort) {}

    execute(identifier: AssociationIdentifier) {
        if (!identifier.siren) return Promise.resolve([]) as Promise<ApplicationFlatEntity[]>;
        return this.port.findBySiren(identifier.siren);
    }
}

const getAssociationApplications = new GetAssociationApplications(applicationFlatAdapter);
export default getAssociationApplications;
