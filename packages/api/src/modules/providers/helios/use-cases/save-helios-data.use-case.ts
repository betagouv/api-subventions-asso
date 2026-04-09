import HeliosDto from "../../../../adapters/inputs/cli/helios/helios.dto";
import HeliosPort from "../../../../adapters/outputs/db/providers/helios/helios.port";
import TransformHeliosDtoToEntityUseCase from "./transform-helios-dto-to-entity.use-case";

export class SaveHeliosDataUseCase {
    constructor(
        private transformUseCase: TransformHeliosDtoToEntityUseCase,
        private heliosPort: HeliosPort,
    ) {}
    execute(dtos: HeliosDto[]) {
        return this.heliosPort.insertMany(dtos.map(dto => this.transformUseCase.execute(dto)));
    }
}
