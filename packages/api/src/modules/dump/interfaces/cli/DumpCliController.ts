import { StaticImplements } from "../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../@types";
import dumpService from "../../dump.service";

@StaticImplements<CliStaticInterface>()
export default class DumpCliController {
    static cmdName = "dump";

    public publishStatsData() {
        return dumpService.publishStatsData();
    }
}
