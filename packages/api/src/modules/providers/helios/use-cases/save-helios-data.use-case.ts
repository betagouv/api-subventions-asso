import HeliosDto from "../../../../adapters/inputs/cli/helios/helios.dto";
import HeliosPort from "../../../../adapters/outputs/db/providers/helios/helios.port";
import SaveHeliosEntitiesToFlatUseCase from "./save-helios-entities-to-flat.use-case";
import TransformHeliosDtoToEntityUseCase from "./transform-helios-dto-to-entity.use-case";

export default class SaveHeliosDataUseCase {
    constructor(
        private transformUseCase: TransformHeliosDtoToEntityUseCase,
        private saveToFlatUseCase: SaveHeliosEntitiesToFlatUseCase,
        private heliosPort: HeliosPort,
    ) {}

    async execute(dtos: HeliosDto[]) {
        const entities = dtos.map(dto => this.transformUseCase.execute(dto));

        // process in order to avoid populate flats if raw persistence fails
        await this.heliosPort.insertMany(entities);
        return this.saveToFlatUseCase.execute(entities);
    }
}
