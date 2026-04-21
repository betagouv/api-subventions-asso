import { CliStaticInterface } from "../../../../@types";
import { StaticImplements } from "../../../../decorators/static-implements.decorator";
import SaveHeliosDataUseCase from "../../../../modules/providers/helios/use-cases/save-helios-data.use-case";
import CliController from "../../../../shared/CliController";
import HeliosMapper from "./helios.mapper";
import HeliosParser from "./helios.parser";

@StaticImplements<CliStaticInterface>()
export default class HeliosCli extends CliController {
    static cmdName = "helios";

    constructor(private saveUseCase: SaveHeliosDataUseCase) {
        super();
    }

    async parse(filePath: string) {
        console.info("start parsing helios file...");
        const dtos = HeliosParser.parse(filePath);
        console.info("start persisting data...");
        await this.saveUseCase.execute(
            dtos
                .filter(dto => dto["IMMATRICULATION"]) // quick filter to omit the empty line that only contain sum of payment
                .map(dto => HeliosMapper.toEntity(dto)),
        );
    }
}
