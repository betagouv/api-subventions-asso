import applicationFlatAdapter from "../../../adapters/outputs/db/application-flat/application-flat.adapter";
import { ApplicationFlatPort } from "../../../adapters/outputs/db/application-flat/application-flat.port";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import { EstablishmentIdentifier } from "../../../identifier-objects";

export class GetEstablishmentApplications {
    constructor(private port: ApplicationFlatPort) {}

    execute(identifier: EstablishmentIdentifier) {
        if (!identifier.siret) return Promise.resolve([]) as Promise<ApplicationFlatEntity[]>;
        return this.port.findBySiret(identifier.siret);
    }
}

const getEstablishmentApplications = new GetEstablishmentApplications(applicationFlatAdapter);
export default getEstablishmentApplications;
