import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import geoService from "../../modules/providers/geoApi/geo.service";

@StaticImplements<CliStaticInterface>()
export default class ConsumerCli {
    static cmdName = "geo";

    async fillGeoTable() {
        await geoService.generateAndSaveEntities();
    }
}
