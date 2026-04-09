import { CliStaticInterface } from "../../../../@types";
import { StaticImplements } from "../../../../decorators/static-implements.decorator";
import { SaveHeliosDataUseCase } from "../../../../modules/providers/helios/use-cases/save-helios-data.use-case";
import CliController from "../../../../shared/CliController";
import HeliosParser from "./helios.parser";

@StaticImplements<CliStaticInterface>()
export default class HeliosCli extends CliController {
    static cmdName = "helios";

    constructor(private saveUseCase: SaveHeliosDataUseCase) {
        super();
    }

    async parse(filePath: string) {
        const dtos = HeliosParser.parse(filePath);
        await this.saveUseCase.execute(dtos);
    }
}
