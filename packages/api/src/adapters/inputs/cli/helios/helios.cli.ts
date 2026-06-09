import path from "path";
import { CliStaticInterface } from "../../../../@types";
import { StaticImplements } from "../../../../decorators/static-implements.decorator";
import SaveHeliosDataUseCase from "../../../../modules/providers/helios/use-cases/save-helios-data.use-case";
import CliController from "../../../../shared/CliController";
import { notifyImportFailure, notifyImportSuccess } from "../../../../shared/helpers/ImportNotification.helper";
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

            await notifyImportSuccess(
                "Helios",
                filePath,
                {
                    parsedCount: dtos.length,
                    importedCount: filteredDtos.length,
                    errorCount: dtos.length - filteredDtos.length,
                },
                Date.now() - startAt,
                { exportDate: new Date(), fileCount: 1 },
            );
        } catch (error) {
            await notifyImportFailure("Helios", error as Error, {
                durationMs: Date.now() - startAt,
                fileName: path.basename(filePath),
            });
            throw error;
        }
    }
}
