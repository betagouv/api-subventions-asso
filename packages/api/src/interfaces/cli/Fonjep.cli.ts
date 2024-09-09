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
import FormatDateError from "../../shared/errors/cliErrors/FormatDateError";

@StaticImplements<CliStaticInterface>()
export default class FonjepCli extends CliController {
    static cmdName = "fonjep";
    protected _providerIdToLog = fonjepService.provider.id;
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
        if (!exportDate) throw new FormatDateError();
        this.logger.logIC("\nStart parse file: ", file);
        this.logger.log(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const { subventions, payments } = FonjepParser.parse(fileContent, exportDate);

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

        const paymentRejected = [] as FonjepRejectedRequest[];

        const paymentsResult = await payments.reduce(async (acc, payment, index) => {
            const result = await acc;
            const response = await fonjepService.createPaymentEntity(payment);

            CliHelper.printProgress(index + 1, payments.length, "payments");

            if (response instanceof FonjepRejectedRequest) {
                paymentRejected.push(response);
                return result;
            }
            result.push(response);
            return result;
        }, Promise.resolve([]) as Promise<(FonjepRejectedRequest | CreateFonjepResponse)[]>);

        this.logger.logIC(`
            ${paymentsResult.length} payments created
            ${paymentRejected.length} payments not valid
        `);

        paymentRejected.forEach(result => {
            this.logger.log(
                `\n\nThis payment is not registered because: ${result.message} \n`,
                JSON.stringify(result.data, null, "\t"),
            );
        });

        await fonjepService.applyTemporyCollection();
    }
}
