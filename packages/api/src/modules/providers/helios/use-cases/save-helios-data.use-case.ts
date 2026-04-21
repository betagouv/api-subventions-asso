import HeliosPort from "../../../../adapters/outputs/db/providers/helios/helios.port";
import { asyncFilter } from "../../../../shared/helpers/ArrayHelper";
import CheckIdentifierIsFromAssoUseCase from "../../../associations/use-cases/check-identifier-is-from-asso.use-case";
import GetIdentifierFromStringUseCase from "../../../associations/use-cases/get-identifier-from-string.use-case";
import SaveHeliosEntitiesToFlatUseCase from "./save-helios-entities-to-flat.use-case";
import HeliosEntity from "../domain/helios.entity";

export default class SaveHeliosDataUseCase {
    constructor(
        private getIdentifier: GetIdentifierFromStringUseCase,
        private checkIsFromAsso: CheckIdentifierIsFromAssoUseCase,
        private saveToFlatUseCase: SaveHeliosEntitiesToFlatUseCase,
        private heliosPort: HeliosPort,
    ) {}

    async execute(entities: HeliosEntity[]) {
        console.info("transform dto into entities...");

        console.info("filter only association lines...");
        const acceptedEntities = await asyncFilter(entities, async entity => {
            const identifier = this.getIdentifier.execute(entity.immatriculation);
            if (!identifier) return false;
            const isFromAsso = await this.checkIsFromAsso.execute(identifier);
            if (isFromAsso) return true;
            else return false;
        });

        console.warn(
            `${entities.length - acceptedEntities.length} entities over ${entities.length} where filtered out as belonging to companies`,
        );

        // process in order to avoid populate flats if raw persistence fails
        console.info("persist data in collection...");
        await this.heliosPort.insertMany(acceptedEntities);
        console.info("saves entities to flats...");
        return this.saveToFlatUseCase.execute(acceptedEntities);
    }
}
