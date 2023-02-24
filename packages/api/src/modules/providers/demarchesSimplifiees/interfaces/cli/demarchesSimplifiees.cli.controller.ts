import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import demarchesSimplifieesService from "../../demarchesSimplifiees.service";

@StaticImplements<CliStaticInterface>()
export default class DemarchesSimplifieesCliController {
    static cmdName = "demarche-simplifiees";

    async test(id: string) {
        try {
            const res = await demarchesSimplifieesService.firstQuery(Number(id) || undefined);
            console.log(res);
        } catch (error) {
            const e = error as Error;
            console.error(e);
        }
    }
}
