import fs from "fs";
import path from "path";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import LeCompteAssoParser from "../../modules/providers/leCompteAsso/leCompteAsso.parser";
import leCompteAssoService, { RejectedRequest } from "../../modules/providers/leCompteAsso/leCompteAsso.service";
import LeCompteAssoRequestEntity from "../../modules/providers/leCompteAsso/entities/LeCompteAssoRequestEntity";
import { COLORS } from "../../shared/LogOptions";
import * as CliHelper from "../../shared/helpers/CliHelper";
import { GenericParser } from "../../shared/GenericParser";

@StaticImplements<CliStaticInterface>()
export default class LeCompteAssoCli {
    static cmdName = "leCompteAsso";

    private logFileParsePath = "./logs/lecompteasso.parse.log.txt";

    public async validate(file: string) {
        if (typeof file !== "string") {
            throw new Error("Validate command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files: string[] = [];

        if (fs.lstatSync(file).isDirectory()) {
            const filesInFolder = fs
                .readdirSync(file)
                .filter(fileName => !fileName.startsWith(".") && !fs.lstatSync(path.join(file, fileName)).isDirectory())
                .map(fileName => path.join(file, fileName));

            files.push(...filesInFolder);
        } else files.push(file);

        await Promise.all(
            files.map(async file => {
                console.info("\nStart validation file: ", file);

                const fileContent = fs.readFileSync(file);

                const entities = await LeCompteAssoParser.parse(fileContent);

                console.info(`Check ${entities.length} entities!`);
                entities.forEach(entity => {
                    const result = leCompteAssoService.validEntity(entity);
                    if (result !== true) {
                        console.error(`${COLORS.FgRed}${result.message}${COLORS.Reset}`, result.data);
                    }
                });

                console.info(`${COLORS.Reset}Validation done`);
            }),
        );
    }

    /**
     * @param file path to file
     */
    public async parse(file: string) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = GenericParser.findFiles(file);

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath}`);
        const logs: unknown[] = [];

        return files
            .reduce((acc, filePath) => {
                return acc.then(() => this._parse(filePath, logs));
            }, Promise.resolve())
            .then(() =>
                fs.writeFileSync(this.logFileParsePath, logs.join(""), {
                    flag: "w",
                    encoding: "utf-8",
                }),
            );
    }

    private async _parse(file: string, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const entities = await LeCompteAssoParser.parse(fileContent);

        let parsageError = false;
        console.info(`${entities.length} entities found in file.`);

        entities.forEach(entity => {
            const result = leCompteAssoService.validEntity(entity);
            if (result === true) return;
            parsageError = true;
        });

        if (parsageError) {
            console.error(`${COLORS.FgRed}An error occurred while parsing the file ${file}${COLORS.Reset}`);
            logs.push(`An error occurred while parsing the file ${file}`);
            console.info(
                "Please use command validator for more information eg. npm run cli leCompteAsso validator YOUR_FILE",
            );
            return;
        }

        console.info("All entities is valid !\nStart register in database ...");

        const results = await entities.reduce(
            async (acc, entity, index) => {
                const data = await acc;

                CliHelper.printProgress(index + 1, entities.length);

                data.push(await leCompteAssoService.addRequest(entity));
                return data;
            },
            Promise.resolve([]) as Promise<
                (
                    | {
                          state: string;
                          result: LeCompteAssoRequestEntity;
                      }
                    | RejectedRequest
                )[]
            >,
        );

        const created = results.filter(({ state }) => state === "created");
        const updated = results.filter(({ state }) => state === "updated");
        const rejected = results.filter(({ state }) => state === "rejected") as RejectedRequest[];

        console.info(`
            ${results.length}/${entities.length}
            ${created.length} requests created and ${updated.length} requests updated
            ${rejected.length} requests not valid
        `);

        rejected.forEach(request => {
            logs.push(
                `\n\nThis request is not registered because: ${request.result.message}\n`,
                JSON.stringify(request.result.data, null, "\t"),
            );
        });
    }
}
