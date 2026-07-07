import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import sireneEtablissementService from "../../../modules/providers/sirene/sirene-etablissement.service";
import sireneStockEtablissementService from "../../../modules/providers/sirene/sirene-stock-etablissement.service";
import CliController from "../../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class SireneStockEtablissementCli extends CliController {
    static cmdName = "sirene-etablissements";

    protected logFileParsePath = "./logs/sirene-stock-etablissement.parse.log.txt";

    async import(filePath?: string) {
        if (filePath) {
            await sireneEtablissementService.parse(filePath);
            return;
        }

        await sireneStockEtablissementService.getAndParse();
    }
}
