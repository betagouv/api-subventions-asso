import { CliStaticInterface } from "../../@types";
import sirenePort from "../../dataProviders/api/SIRENE/sirene.port";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class PocCli extends CliController {
    static cmdName = "poc";

    public async test() {
        const url = "https://www.data.gouv.fr/fr/datasets/r/825f4199-cadd-486c-ac46-a65a8ea1a047";

        await sirenePort.downloadAndExtractSireneZip();
    }
}
