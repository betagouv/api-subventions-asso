import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import dumpService from "../../modules/dump/dump.service";

@StaticImplements<CliStaticInterface>()
export default class DumpInterfaceCli {
    static cmdName = "dump";

    public publishStatsData() {
        return dumpService.publishStatsData();
    }
}
