import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import CliController from "../../shared/CliController";
import fonjepService from "../../modules/providers/fonjep/fonjep.service";

@StaticImplements<CliStaticInterface>()
export default class FonjepCli extends CliController {
    static cmdName = "fonjep";
    protected _providerIdToLog = fonjepService.meta.id;
    protected logFileParsePath = "./logs/fonjep.parse.log.txt";

    /**
     * @example pnpm cli fonjep parse ./Extraction\ du\ 30-12-2022.xlsx 2022-12-30
     *
     * @param file Path to the file
     * @param logs is auto-injected by cli controller
     * @param exportDate Explicite date of import (any valid date string, like "YYYY-MM-DD")
     *
     */

    protected async _parse(file: string, logs: unknown[], exportDate: Date | undefined) {
        this.logger.logIC("\nStart parse file: ", file);
        this.logger.log(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        if (!exportDate) throw new Error("Export date is mandatory for fonjep import");

        const { tierEntities, posteEntities, versementEntities, typePosteEntities, dispositifEntities } =
            fonjepService.fromFileToEntities(file, exportDate);

        fonjepService.useTemporyCollection(true);

        this.logger.logIC("Start register in database ...");

        await fonjepService.createFonjepCollections(
            tierEntities,
            posteEntities,
            versementEntities,
            typePosteEntities,
            dispositifEntities,
        );

        // TODO: make PaymentFlat use the same ReadableStream architecture yo be ISO with ApplicationFlat ?
        await fonjepService.addToPaymentFlat({
            thirdParties: tierEntities,
            positions: posteEntities,
            payments: versementEntities,
        });

        await fonjepService.addToApplicationFlat({
            positions: posteEntities,
            schemes: dispositifEntities,
            thirdParties: tierEntities,
        });

        this.logger.logIC("Fonjep temps collections created");

        await fonjepService.applyTemporyCollection();

        this.logger.logIC("Fonjep collections created or updated");
    }

    // ONLY USED FOR TEST / CLEAN PURPOSE AFTER BUG DETECTION TO AVOID REIMPORTING FONJEP DATA
    // creates all fonjep payment-flat from collection
    async initPaymentFlat() {
        const { thirdParties, positions, payments } = await fonjepService.getPaymentFlatCollections();
        // TODO: make PaymentFlat use the same ReadableStream architecture yo be ISO with ApplicationFlat ?
        await fonjepService.createPaymentFlatEntitiesFromCollections({
            thirdParties,
            positions,
            payments,
        });
    }
}
