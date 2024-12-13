import fs from "fs";

import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import CliController from "../../shared/CliController";
import fonjepService from "../../modules/providers/fonjep/fonjep.service";
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
        this.logger.logIC("\nStart parse file: ", file);
        this.logger.log(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const { tierEntities, posteEntities, versementEntities, typePosteEntities, dispositifEntities } =
            fonjepService.fromFileToEntities(file);

        fonjepService.useTemporyCollection(true);

        this.logger.logIC("Start register in database ...");

        fonjepService.createFonjepCollections(
            tierEntities,
            posteEntities,
            versementEntities,
            typePosteEntities,
            dispositifEntities,
        );

        this.logger.logIC("Fonjep temps collections created");

        await fonjepService.applyTemporyCollection();

        this.logger.logIC("Fonjep collections created or updated");
    }
}
