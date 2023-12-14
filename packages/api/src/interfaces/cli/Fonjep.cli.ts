import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import FonjepParser from "../../modules/providers/fonjep/fonjep.parser";
import fonjepService, {
    CreateFonjepResponse,
    FonjepRejectedRequest,
} from "../../modules/providers/fonjep/fonjep.service";
import * as CliHelper from "../../shared/helpers/CliHelper";
import CliController from "../../shared/CliController";
import ExportDateError from "../../shared/errors/cliErrors/ExportDateError";

@StaticImplements<CliStaticInterface>()
export default class FonjepCli extends CliController {
    static cmdName = "fonjep";

    protected logFileParsePath = "./logs/fonjep.parse.log.txt";

    /**
     * @example npm run cli fonjep parse ./Extraction\ du\ 30-12-2022.xlsx 2022-12-30
     *
     * @param file Path to the file
     * @param logs is auto-injected by cli controller
     * @param exportDate Explicite date of import (any valid date string, like "YYYY-MM-DD")
     *
     */
    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        if (!exportDate) throw new ExportDateError();
        this.logger.logIC("\nStart parse file: ", file);
        this.logger.log(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const { subventions, versements } = FonjepParser.parse(fileContent, exportDate);

        fonjepService.useTemporyCollection(true);

        this.logger.logIC("Start register in database ...");

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

        this.logger.logIC(`
            ${subventionsResult.length} subventions created
            ${subventionRejected.length} subventions not valid
        `);

        subventionRejected.forEach(result => {
            this.logger.log(
                `\n\nThis subvention is not registered because: ${result.message} \n`,
                JSON.stringify(result.data, null, "\t"),
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

        this.logger.logIC(`
            ${versementsResult.length} versements created
            ${versementRejected.length} versements not valid
        `);

        versementRejected.forEach(result => {
            this.logger.log(
                `\n\nThis versement is not registered because: ${result.message} \n`,
                JSON.stringify(result.data, null, "\t"),
            );
        });

        await fonjepService.applyTemporyCollection();
    }
}
