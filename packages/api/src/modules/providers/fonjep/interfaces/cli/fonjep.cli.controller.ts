import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import FonjepParser from "../../fonjep.parser";
import fonjepService, { CreateFonjepResponse, FonjepRejectedRequest } from "../../fonjep.service";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import CliController from "../../../../../shared/CliController";
import ExportDateError from "../../../../../shared/errors/cliErrors/ExportDateError";

@StaticImplements<CliStaticInterface>()
export default class FonjepCliController extends CliController {
    static cmdName = "fonjep";

    protected logFileParsePath = "./logs/fonjep.parse.log.txt";

    // Called in CliController parse()
    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        if (!exportDate) throw new ExportDateError();
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const { subventions, versements } = FonjepParser.parse(fileContent, exportDate);

        console.info("Start register in database ...");

        const subventionRejected = [] as FonjepRejectedRequest[];

        const subventionsResult = await subventions.reduce(async (acc, subvention, index) => {
            const result = await acc;
            const response = await fonjepService.createSubventionEntity(subvention);

            CliHelper.printProgress(index + 1, subventions.length, "subventions");

            if (response instanceof FonjepRejectedRequest) {
                subventionRejected.push(response);
                return result;
            }

            result.push(response);
            return result;
        }, Promise.resolve([]) as Promise<(FonjepRejectedRequest | CreateFonjepResponse)[]>);

        console.info(`
            ${subventionsResult.length} subventions created
            ${subventionRejected.length} subventions not valid
        `);

        subventionRejected.forEach(result => {
            logs.push(
                `\n\nThis subvention is not registered because: ${result.message} \n`,
                JSON.stringify(result.data, null, "\t")
            );
        });

        const versementRejected = [] as FonjepRejectedRequest[];

        const versementsResult = await versements.reduce(async (acc, versement, index) => {
            const result = await acc;
            const response = await fonjepService.createVersementEntity(versement);

            CliHelper.printProgress(index + 1, versements.length, "versements");

            if (response instanceof FonjepRejectedRequest) {
                versementRejected.push(response);
                return result;
            }
            result.push(response);
            return result;
        }, Promise.resolve([]) as Promise<(FonjepRejectedRequest | CreateFonjepResponse)[]>);

        console.info(`
            ${versementsResult.length} versements created
            ${versementRejected.length} versements not valid
        `);

        versementRejected.forEach(result => {
            logs.push(
                `\n\nThis versement is not registered because: ${result.message} \n`,
                JSON.stringify(result.data, null, "\t")
            );
        });
    }

    public async drop() {
        await fonjepService.dropCollection();
    }

    public async rename(newTableName: string | undefined) {
        if (!newTableName) {
            throw new Error("newTableName arguments is missing");
        }

        await fonjepService.renameCollection(newTableName);
    }
}
