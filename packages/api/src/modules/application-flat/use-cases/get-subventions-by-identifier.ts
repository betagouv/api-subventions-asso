import applicationFlatAdapter from "../../../adapters/outputs/db/application-flat/application-flat.adapter";
import { ApplicationFlatPort } from "../../../adapters/outputs/db/application-flat/application-flat.port";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import { AssociationIdentifier, EstablishmentIdentifier } from "../../../identifier-objects";
import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";
import transformToDemandeSubvention, { TransformToDemandeSubvention } from "./transform-to-demande-subvention";

export class GetSubventionsByIdentifier {
    constructor(
        private port: ApplicationFlatPort,
        private transform: TransformToDemandeSubvention,
    ) {}

    async execute(identifier: StructureIdentifier) {
        let entities: ApplicationFlatEntity[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await this.port.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await this.port.findBySiren(identifier.siren);
        } else return [];

        return entities.map(entity => this.transform.execute(entity)).filter(sub => sub !== null);
    }
}

const getSubventionsByIdentifier = new GetSubventionsByIdentifier(applicationFlatAdapter, transformToDemandeSubvention);
export default getSubventionsByIdentifier;
