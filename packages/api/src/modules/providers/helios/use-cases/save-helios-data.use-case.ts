import HeliosDto from "../../../../adapters/inputs/cli/helios/helios.dto";
import HeliosPort from "../../../../adapters/outputs/db/providers/helios/helios.port";
import { asyncFilter } from "../../../../shared/helpers/ArrayHelper";
import CheckIdentifierIsFromAssoUseCase from "../../../associations/use-cases/check-identifier-is-from-asso.use-case";
import GetIdentifierFromStringUseCase from "../../../associations/use-cases/get-identifier-from-string.use-case";
import SaveHeliosEntitiesToFlatUseCase from "./save-helios-entities-to-flat.use-case";
import TransformHeliosDtoToEntityUseCase from "./transform-helios-dto-to-entity.use-case";

export default class SaveHeliosDataUseCase {
    constructor(
        private transformUseCase: TransformHeliosDtoToEntityUseCase,
        private getIdentifier: GetIdentifierFromStringUseCase,
        private checkIsFromAsso: CheckIdentifierIsFromAssoUseCase,
        private saveToFlatUseCase: SaveHeliosEntitiesToFlatUseCase,
        private heliosPort: HeliosPort,
    ) {}

    async execute(dtos: HeliosDto[]) {
        const entities = dtos
            .filter(dto => dto["IMMATRICULATION"]) // quick filter to omit the empty line that only contain sum of payment
            .map(dto => this.transformUseCase.execute(dto));

        const acceptedEntities = await asyncFilter(entities, async entity => {
            const identifier = this.getIdentifier.execute(entity.immatriculation);
            if (!identifier) return false;
            const isFromAsso = await this.checkIsFromAsso.execute(identifier);
            if (isFromAsso) return true;
            else return false;
        });

        // process in order to avoid populate flats if raw persistence fails
        await this.heliosPort.insertMany(acceptedEntities);
        return this.saveToFlatUseCase.execute(acceptedEntities);
    }
}
