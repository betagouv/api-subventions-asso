import { ProviderEnum } from "../../../@enums/ProviderEnum";
import MiscScdlMapper from "./mappers/misc-scdl.mapper";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import { ReadableStream, TransformStream } from "node:stream/web";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";

export class ScdlGrantService implements ApplicationFlatProvider {
    meta = {
        name: "Open Data SCDL",
        type: ProviderEnum.raw,
        id: "miscScdl",
        description: "Données au format SCDL de divers producteurs en Open Data",
    };

    /**
     *
     *        APPLICATION FLAT PART
     *
     */

    saveDbosToApplicationFlat(dbos: ScdlGrantDbo[]) {
        const readStream = this.dbosToApplicationFlatStream(dbos);
        return this.saveApplicationsFromStream(readStream);
    }

    dbosToApplicationFlatStream(dbos: ScdlGrantDbo[]) {
        const stream: ReadableStream = ReadableStream.from(dbos);
        return stream.pipeThrough(
            new TransformStream<ScdlGrantDbo, ApplicationFlatEntity>({
                start() {},
                transform: (dbo, controller) => controller.enqueue(MiscScdlMapper.dboToApplicationFlat(dbo)),
            }),
        );
    }

    async saveApplicationsFromStream(stream: ReadableStream<ApplicationFlatEntity>): Promise<void> {
        await applicationFlatService.saveFromStream(stream);
    }

    async initApplicationFlat() {
        const cursor = miscScdlGrantPort.findAllCursor();
        const stream: ReadableStream<ApplicationFlatEntity> = cursorToStream(cursor, dbo =>
            MiscScdlMapper.dboToApplicationFlat(dbo),
        );
        return this.saveApplicationsFromStream(stream);
    }
}

const scdlGrantService = new ScdlGrantService();
export default scdlGrantService;
