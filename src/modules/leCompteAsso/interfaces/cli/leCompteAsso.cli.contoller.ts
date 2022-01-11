import fs from "fs";

import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../@types/Cli.interface";
import LeCompteAssoParser from "../../leCompteAsso.parser";
import leCompteAssoService, { RejectedRequest } from "../../leCompteAsso.service";
import LeCompteAssoRequestEntity from "../../entities/LeCompteAssoRequestEntity";
import { COLORS } from "../../../../shared/LogOptions"

@StaticImplements<CliStaticInterface>()
export default class LeCompteAssoCliController {
    static cmdName = "leCompteAsso";

    public async validate(file: string) {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const fileContent = fs.readFileSync(file);

        const entities = await LeCompteAssoParser.parse(fileContent);

        console.info(`Check ${entities.length} entities!`);
        entities.forEach((entity) => {
            const result = leCompteAssoService.validEntity(entity);
            if (!result.success) {
                console.error(`${COLORS.FgRed}${result.msg}${COLORS.Reset}`, result.data);
            }
        });

        console.info(`${COLORS.Reset}Validation done`);
    }

    /**
     * @param file path to file
     * @param params --verbose or -v for more logs 
     */
    public async parse(file: string, ...params: string[]) {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const options = {
            verbose: params.includes('--verbose') || params.includes('-v')
        }

        const fileContent = fs.readFileSync(file);

        const entities = await LeCompteAssoParser.parse(fileContent);

        let parsageError = false;
        console.info(`Check ${entities.length} entities!`);

        entities.forEach((entity) => {
            const result = leCompteAssoService.validEntity(entity);
            if (result.success) return
            parsageError = true;
        });

        if (parsageError) {
            console.error(`${COLORS.FgRed}An error occurred while parsing the file${COLORS.Reset}`);
            console.log("Please use commande validator for more informations eg. npm run cli leCompteAsso validator YOUR_FILE");
            return;
        }

        console.info(`${entities.length} requests found ! Save in applications !`)
        return entities.reduce((acc, entity, index) => {
            return acc.then(
                (data = []) => {
                    console.log(`${index + 1} / ${entities.length}`);
                    return leCompteAssoService.addRequest(entity).then((result) => data.concat(result))
                }
            );
        }, Promise.resolve([]) as Promise<
        ({
            state: string, 
            result: LeCompteAssoRequestEntity
        } 
        | RejectedRequest)[]>).then(results => {
            const created = results.filter(({state}) => state === "created");
            const updated = results.filter(({state}) => state === "updated");
            const rejected = results.filter(({state}) => state === "rejected") as RejectedRequest[];

            console.info(`${created.length} folders created and ${updated.length} folders updated`);

            if (rejected.length) {
                const {rnaNotFound, categoriesNotValid} = rejected.reduce((accRejected, request) => {
                    if (request.result.code === 10) {
                        accRejected.categoriesNotValid.push(request);
                    } else if (request.result.code === 11) {
                        accRejected.rnaNotFound.push(request);
                    }
                    return accRejected;
                }, {rnaNotFound: [] as RejectedRequest[], categoriesNotValid: [] as RejectedRequest[] });

                if (categoriesNotValid.length) {
                    console.log("\n-------------------------------------------------------------")
                    console.warn(`${categoriesNotValid.length} request with legal category not valid`);
                    if (options.verbose) {
                        console.log("\n");
                        categoriesNotValid.forEach(request => console.warn(request));
                        console.log("\n-------------------------------------------------------------")
                    }
                }


                if (rnaNotFound.length) {
                    console.log("\n-------------------------------------------------------------")
                    console.error(`${rnaNotFound.length} request without rna found`);
                    if (options.verbose) {
                        console.log("\n");
                        rnaNotFound.forEach(request => console.error(request));
                        console.log("\n-------------------------------------------------------------");
                    }
                }
            }
        });
    }

}