import fs from "fs";
import path from "path";

import { StaticImplements } from "../../../../decorators/static-implements.decorator";
import { ApplicationFlatCli, CliStaticInterface } from "../../../../@types";
import OsirisParser from "./osiris.parser";
import osirisService from "../../../../modules/providers/osiris/osiris.service";
import OsirisRequestEntity from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import OsirisRequestDto from "./osiris-request.dto";
import OsirisRequestMapper from "./osiris-request.mapper";
import OsirisActionMapper from "./osiris-action.mapper";
import * as CliHelper from "../../../../shared/helpers/CliHelper";
import { GenericParser } from "../../../../shared/GenericParser";
import dataLogService from "../../../../modules/data-log/dataLog.service";
import OsirisActionDto from "./osiris-action.dto";
import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import Siret from "../../../../identifier-objects/Siret";
import { isCompteAssoId, isOsirisActionId, isOsirisRequestId } from "../../../../shared/Validators";
import { InvalidOsirisRequestError } from "../../../../modules/providers/osiris/osiris.errors";
import { ImportReport } from "../../../../@types/ImportReport";
import { notifyImportFailureUseCase } from "../../../../modules/notify/use-cases/notify-import-failure.use-case";
import { notifyImportSuccessUseCase } from "../../../../modules/notify/use-cases/notify-import-success.use-case";

@StaticImplements<CliStaticInterface>()
export default class OsirisCli implements ApplicationFlatCli {
    static cmdName = "osiris";

    private logFileParsePath = {
        actions: "./logs/osiris.parse.actions.log.txt",
        requests: "./logs/osiris.parse.requests.log.txt",
    };

    private static validateRequestDto(dto: OsirisRequestDto): { message: string; data: unknown } | true {
        if (!Siret.isSiret(dto.association?.siret ?? "")) {
            return {
                message: `INVALID SIRET (${dto.association?.siret})`,
                data: dto.association,
            };
        }

        if (!isOsirisRequestId(dto.dossier?.osirisId ?? "")) {
            return {
                message: `INVALID OSIRIS ID (${dto.dossier?.osirisId}) FOR SIRET ${dto.association?.siret}`,
                data: dto.dossier,
            };
        }

        return true;
    }

    private static validateActionDto(dto: OsirisActionDto): { message: string; data: unknown } | true {
        if (!isCompteAssoId(dto.dossier?.compteAssoId ?? "")) {
            return {
                message: `INVALID COMPTE ASSO ID (${dto.dossier?.compteAssoId}) FOR SIRET ${dto.beneficiaire?.siret}`,
                data: dto.dossier,
            };
        }

        if (!isOsirisActionId(dto.dossier?.numeroActionOsiris ?? "")) {
            return {
                message: `INVALID OSIRIS ACTION ID (${dto.dossier?.numeroActionOsiris}) FOR SIRET ${dto.beneficiaire?.siret}`,
                data: dto.dossier,
            };
        }

        return true;
    }

    public async parse(type: "requests" | "actions", file: string, extractYear: string): Promise<void> {
        if (typeof type != "string" && typeof file != "string" && typeof extractYear != "string") {
            throw new Error("Parse command need type, extractYear and file args");
        }

        if (Number.isNaN(parseInt(extractYear, 10))) {
            throw new Error("extractYear must be a number");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = GenericParser.findFiles(file);
        const year = parseInt(extractYear, 10);
        const logs: unknown[] = [];

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath[type]}`);

        const startAt = Date.now();
        const fileReports: ImportReport[] = [];

        try {
            await files
                .reduce((acc, filePath) => {
                    return acc.then(async () => {
                        const result = await this._parse(type, filePath, year, logs);
                        if (result) fileReports.push(result);
                    });
                }, Promise.resolve())
                .then(() =>
                    fs.writeFileSync(this.logFileParsePath[type], logs.join(""), {
                        flag: "w",
                        encoding: "utf-8",
                    }),
                );
        } catch (error) {
            const partialReport: ImportReport = {
                parsedCount: fileReports.reduce((sum, r) => sum + r.parsedCount, 0),
                importedCount: fileReports.reduce((sum, r) => sum + r.importedCount, 0),
                errorCount: fileReports.reduce((sum, r) => sum + r.errorCount, 0),
            };
            await notifyImportFailureUseCase.execute(osirisService.meta.name, error as Error, {
                durationMs: Date.now() - startAt,
                fileName: path.basename(file),
                exerciseYear: year,
                fileCount: files.length,
                report: partialReport,
            });
            throw error;
        }

        if (fileReports.length > 0) {
            const aggregated: ImportReport = {
                parsedCount: fileReports.reduce((sum, r) => sum + r.parsedCount, 0),
                importedCount: fileReports.reduce((sum, r) => sum + r.importedCount, 0),
                errorCount: fileReports.reduce((sum, r) => sum + r.errorCount, 0),
            };
            await notifyImportSuccessUseCase.execute(osirisService.meta.name, file, aggregated, {
                durationMs: Date.now() - startAt,
                fileCount: files.length,
                exerciseYear: year,
            });
        }
    }

    protected async _parse(type: string, file: string, year: number, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        let importReport: ImportReport;

        if (type === "requests") {
            importReport = await this._parseRequest(fileContent, year, logs);
        } else if (type === "actions") {
            importReport = await this._parseAction(fileContent, year, logs);
        } else {
            throw new Error(`The type ${type} is not taken into account`);
        }

        await dataLogService.addFromFile({
            providerId: osirisService.meta.id,
            providerName: osirisService.meta.name,
            fileName: file,
            // this assumes that extraction date is close enough to integration date
            editionDate: new Date(),
        });

        return importReport;
    }

    async _parseRequest(contentFile: Buffer, year: number, logs: unknown[]) {
        let nbErrors = 0;
        const dtos: OsirisRequestDto[] = OsirisParser.parseRequests(contentFile).map(raw =>
            OsirisRequestMapper.toDto(raw),
        );
        const entities: OsirisRequestEntity[] = dtos
            .filter(dto => {
                const dtoValidation = OsirisCli.validateRequestDto(dto);
                if (dtoValidation === true) return true;

                logs.push(
                    `\n\nThis request is not registered because: ${dtoValidation.message}\n`,
                    JSON.stringify(dtoValidation.data, null, "\t"),
                );

                nbErrors += 1;
                return false;
            })
            .map(dto => OsirisRequestMapper.toEntity(dto, year));

        let tictackClock = true;
        const ticTacInterval = setInterval(() => {
            tictackClock = !tictackClock;
            console.log(tictackClock ? "TIC" : "TAC");
        }, 100000);

        const validated: OsirisRequestEntity[] = [];
        let result;

        try {
            // validate all requests in any order
            await Promise.all(
                entities.map(osirisRequest =>
                    osirisService
                        .validateRequest(osirisRequest)
                        .then(() => validated.push(osirisRequest))
                        .catch((e: unknown) => {
                            if (!(e instanceof InvalidOsirisRequestError)) throw e;

                            logs.push(
                                `\n\nThis request is not registered because: ${e.validation.message}\n`,
                                JSON.stringify(e.validation.data, null, "\t"),
                            );

                            nbErrors += 1;
                        }),
                ),
            );

            result = await osirisService.bulkAddRequest(validated);
        } finally {
            clearInterval(ticTacInterval);
        }

        CliHelper.printProgress(validated.length, dtos.length);

        console.info(`
            ${validated.length}/${dtos.length}
            ${result.insertedCount + result.upsertedCount} requests created and ${
                result.modifiedCount + result.matchedCount
            } requests updated
            ${nbErrors} requests not valid
        `);

        return {
            parsedCount: dtos.length,
            importedCount: validated.length,
            errorCount: nbErrors,
        };
    }

    async _parseAction(contentFile: Buffer, year: number, logs: unknown[]) {
        let nbErrors = 0;
        const dtos: OsirisActionDto[] = OsirisParser.parseActions(contentFile, year).map(raw =>
            OsirisActionMapper.toDto(raw),
        );
        const entities: OsirisActionEntity[] = dtos
            .filter(dto => {
                const dtoValidation = OsirisCli.validateActionDto(dto);
                if (dtoValidation === true) return true;

                logs.push(
                    `\n\nThis action is not registered because: ${dtoValidation.message}\n`,
                    JSON.stringify(dtoValidation.data, null, "\t"),
                );

                nbErrors += 1;
                return false;
            })
            .map(dto => OsirisActionMapper.toEntity(dto, year));

        let tictackClock = true;
        const ticTacInterval = setInterval(() => {
            tictackClock = !tictackClock;
            console.log(tictackClock ? "TIC" : "TAC");
        }, 100000);

        let result;

        try {
            result = await osirisService.bulkAddActions(entities);
        } finally {
            clearInterval(ticTacInterval);
        }

        CliHelper.printProgress(entities.length, dtos.length);

        console.info(`
            ${entities.length}/${dtos.length}
            ${result.insertedCount + result.upsertedCount} actions created and ${
                result.modifiedCount + result.matchedCount
            } actions updated
            ${nbErrors} actions not valid
        `);

        return {
            parsedCount: dtos.length,
            importedCount: entities.length,
            errorCount: nbErrors,
        };
    }

    async initApplicationFlat() {
        return await osirisService.initApplicationFlat();
    }

    async syncApplicationFlat(exercise: number) {
        return await osirisService.syncApplicationFlat(exercise);
    }
}
