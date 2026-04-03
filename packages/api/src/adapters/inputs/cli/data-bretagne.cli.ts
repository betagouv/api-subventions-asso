import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import dataBretagneService from "../../../modules/providers/data-bretagne/data-bretagne.service";

@StaticImplements<CliStaticInterface>()
export default class DataBretagneCli {
    static cmdName = "data-bretagne";

    async resync() {
        await dataBretagneService.resyncPrograms();
    }
}
