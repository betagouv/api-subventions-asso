import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import dataBretagneService from "../../modules/providers/dataBretagne/dataBretagne.service";

@StaticImplements<CliStaticInterface>()
export default class DataBretagneCli {
    static cmdName = "data-bretagne";

    async update() {
        await dataBretagneService.update();
    }
}
