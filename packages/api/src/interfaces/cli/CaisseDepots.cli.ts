import CliController from "../../shared/CliController";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import caisseDepotsService from "../../modules/providers/caisseDepots/caisseDepots.service";

@StaticImplements<CliStaticInterface>()
export default class CaisseDepotsCli extends CliController {
    static cmdName = "caisseDepots";

    public async test() {
        console.log(await caisseDepotsService.test());
    }
}
