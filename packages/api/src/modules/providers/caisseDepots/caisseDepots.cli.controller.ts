import caisseDepotsService from "./caisseDepots.service";
import CliController from "../../../shared/CliController";
import { StaticImplements } from "../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../@types";

@StaticImplements<CliStaticInterface>()
export default class CaisseDepotsCliController extends CliController {
    static cmdName = "caisseDepots";

    public async test() {
        console.log(await caisseDepotsService.test());
    }
}
