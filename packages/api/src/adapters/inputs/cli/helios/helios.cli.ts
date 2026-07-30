import path from "path";
import { CliStaticInterface } from "../../../../@types";
import { StaticImplements } from "../../../../decorators/static-implements.decorator";
import SaveHeliosDataUseCase from "../../../../modules/providers/helios/use-cases/save-helios-data.use-case";
import CliController from "../../../../shared/CliController";
import { notifyImportFailureUseCase } from "../../../../modules/notify/use-cases/notify-import-failure.use-case";
import { notifyImportSuccessUseCase } from "../../../../modules/notify/use-cases/notify-import-success.use-case";
import HeliosMapper from "./helios.mapper";
import HeliosParser from "./helios.parser";

@StaticImplements<CliStaticInterface>()
export default class HeliosCli extends CliController {
    static cmdName = "helios";

    constructor(private saveUseCase: SaveHeliosDataUseCase) {
        super();
    }

    async parse(filePath: string) {
        const startAt = Date.now();
        try {
            console.info("start parsing helios file...");
            const dtos = HeliosParser.parse(filePath);
            const filteredDtos = dtos.filter(dto => dto["IMMATRICULATION"]); // quick filter to omit the empty line that only contain sum of payment
            console.info("start persisting data...");
            await this.saveUseCase.execute(filteredDtos.map(dto => HeliosMapper.toEntity(dto)));

            await notifyImportSuccessUseCase.execute({
                providerName: "Helios",
                file: filePath,
                report: {
                    parsedCount: dtos.length,
                    importedCount: filteredDtos.length,
                    errorCount: dtos.length - filteredDtos.length,
                },
                context: { durationMs: Date.now() - startAt, exportDate: new Date(), fileCount: 1 },
            });
        } catch (error) {
            await notifyImportFailureUseCase.execute({
                providerName: "Helios",
                error: error as Error,
                context: {
                    durationMs: Date.now() - startAt,
                    fileName: path.basename(filePath),
                },
            });
            throw error;
        }
    }
}
