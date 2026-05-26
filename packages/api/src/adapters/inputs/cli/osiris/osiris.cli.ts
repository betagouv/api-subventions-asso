import fs from "fs";

import { StaticImplements } from "../../../../decorators/static-implements.decorator";
import { ApplicationFlatCli, CliStaticInterface } from "../../../../@types";
import OsirisParser from "./osiris.parser";
import osirisService, { InvalidOsirisRequestError } from "../../../../modules/providers/osiris/osiris.service";
import OsirisRequestEntity from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import OsirisRequestDto from "./osiris-request.dto";
import OsirisRequestMapper from "./osiris-request.mapper";
import OsirisActionMapper from "./osiris-action.mapper";
import * as CliHelper from "../../../../shared/helpers/CliHelper";
import { GenericParser } from "../../../../shared/GenericParser";
import dataLogService from "../../../../modules/data-log/dataLog.service";
import OsirisActionDto from "./osiris-action.dto";
import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import { isCompteAssoId, isOsirisActionId } from "../../../../shared/Validators";

@StaticImplements<CliStaticInterface>()
export default class OsirisCli implements ApplicationFlatCli {
    static cmdName = "osiris";

    private logFileParsePath = {
        actions: "./logs/osiris.parse.actions.log.txt",
        requests: "./logs/osiris.parse.requests.log.txt",
    };

    private static isCompleteRequestDto(dto: OsirisRequestDto): boolean {
        return Boolean(dto.dossier?.osirisId);
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

    public async parse(
        type: "requests" | "actions",
        file: string,
        extractYear: string,
        mode?: string,
    ): Promise<unknown> {
        if (typeof type != "string" && typeof file != "string" && typeof extractYear != "string") {
            throw new Error("Parse command need type, extractYear and file args");
        }

        if (Number.isNaN(parseInt(extractYear, 10))) {
            throw new Error("extractYear must be a number");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const rnaNeeded: boolean = mode?.toUpperCase() === "WITHOUT-RNA" ? false : true; // true by default to exclude potential companies (which cannot have an RNA)

        const files = GenericParser.findFiles(file);
        const logs: unknown[] = [];

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath}`);

        return files
            .reduce((acc, filePath) => {
                return acc.then(() => this._parse(type, filePath, parseInt(extractYear, 10), logs, rnaNeeded));
            }, Promise.resolve())
            .then(() =>
                fs.writeFileSync(this.logFileParsePath[type], logs.join(""), {
                    flag: "w",
                    encoding: "utf-8",
                }),
            );
    }

    protected async _parse(type: string, file: string, year: number, logs: unknown[], rnaNeeded = true) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        if (type === "requests") {
            await this._parseRequest(fileContent, year, logs, rnaNeeded);
        } else if (type === "actions") {
            await this._parseAction(fileContent, year, logs);
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
    }

    async _parseRequest(contentFile: Buffer, year: number, logs: unknown[], rnaNeeded = true) {
        const dtos: OsirisRequestDto[] = OsirisParser.parseRequests(contentFile).map(raw =>
            OsirisRequestMapper.toDto(raw),
        );

        const entities: OsirisRequestEntity[] = dtos
            .filter(dto => OsirisCli.isCompleteRequestDto(dto))
            .map(dto => OsirisRequestMapper.toEntity(dto, year));

        let nbErrors = 0;
        let tictackClock = true;

        const ticTacInterval = setInterval(() => {
            tictackClock = !tictackClock;
            console.log(tictackClock ? "TIC" : "TAC");
        }, 100000);

        const validated: OsirisRequestEntity[] = [];

        // validate all requests in any order
        await Promise.all(
            entities.map(r =>
                osirisService
                    .validateAndComplete(r, rnaNeeded)
                    .then(() => validated.push(r))
                    .catch((e: unknown) => {
                        const isInvalidOsirisRequestError = e instanceof InvalidOsirisRequestError;
                        const data = isInvalidOsirisRequestError ? e.validation.data : undefined;
                        const message = isInvalidOsirisRequestError
                            ? e.validation.message
                            : String(e instanceof Error ? e.message : e);

                        logs.push(
                            `\n\nThis request is not registered because: ${message}\n`,
                            JSON.stringify(data, null, "\t"),
                        );

                        nbErrors += 1;
                    }),
            ),
        );

        const result = await osirisService.bulkAddRequest(validated);

        clearInterval(ticTacInterval);

        if (!result) return;

        CliHelper.printProgress(validated.length, entities.length);

        console.info(`
            ${validated.length}/${entities.length}
            ${result.insertedCount + result.upsertedCount} requests created and ${
                result.modifiedCount + result.matchedCount
            } requests updated
            ${nbErrors} requests not valid
        `);
    }

    async _parseAction(contentFile: Buffer, year: number, logs: unknown[]) {
        const dtos: OsirisActionDto[] = OsirisParser.parseActions(contentFile, year).map(raw =>
            OsirisActionMapper.toDto(raw),
        );

        let nbErrors = 0;
        const validDtos: OsirisActionDto[] = [];

        dtos.forEach(dto => {
            const validation = OsirisCli.validateActionDto(dto);

            if (validation !== true) {
                logs.push(
                    `\n\nThis action is not registered because: ${validation.message}\n`,
                    JSON.stringify(validation.data, null, "\t"),
                );

                nbErrors += 1;
            } else validDtos.push(dto);
        });

        const entities: OsirisActionEntity[] = validDtos.map(dto => OsirisActionMapper.toEntity(dto, year));

        let tictackClock = true;

        const ticTacInterval = setInterval(() => {
            tictackClock = !tictackClock;
            console.log(tictackClock ? "TIC" : "TAC");
        }, 100000);

        const result = await osirisService.bulkAddActions(entities);

        clearInterval(ticTacInterval);

        if (!result) return;

        CliHelper.printProgress(entities.length, entities.length);

        console.info(`
            ${entities.length}/${dtos.length}
            ${result.insertedCount + result.upsertedCount} actions created and ${
                result.modifiedCount + result.matchedCount
            } actions updated
            ${nbErrors} actions not valid
        `);
    }

    async initApplicationFlat() {
        return await osirisService.initApplicationFlat();
    }

    async syncApplicationFlat(exercise: number) {
        return await osirisService.syncApplicationFlat(exercise);
    }
}
