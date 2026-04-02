import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import dataBretagneService from "../../../modules/providers/dataBretagne/dataBretagne.service";

@StaticImplements<CliStaticInterface>()
export default class DataBretagneCli {
    static cmdName = "data-bretagne";

    async resync() {
        await dataBretagneService.resyncPrograms();
    }
}
