import { ProviderEnum } from "../../../@enums/ProviderEnum";
import MiscScdlAdapter from "./adapters/MiscScdl.adapter";
import ApplicationFlatProvider from "../../applicationFlat/@types/applicationFlatProvider";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
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
        return this.saveFlatFromStream(readStream);
    }

    dbosToApplicationFlatStream(dbos: ScdlGrantDbo[]) {
        const stream: ReadableStream = ReadableStream.from(dbos);
        return stream.pipeThrough(
            new TransformStream<ScdlGrantDbo, ApplicationFlatEntity>({
                start() {},
                transform: (dbo, controller) => controller.enqueue(MiscScdlAdapter.dboToApplicationFlat(dbo)),
            }),
        );
    }

    async saveFlatFromStream(stream: ReadableStream<ApplicationFlatEntity>): Promise<void> {
        await applicationFlatService.saveFromStream(stream);
    }

    async initApplicationFlat() {
        const cursor = miscScdlGrantPort.findAllCursor();
        const stream: ReadableStream<ApplicationFlatEntity> = cursorToStream(cursor, dbo =>
            MiscScdlAdapter.dboToApplicationFlat(dbo),
        );
        return this.saveFlatFromStream(stream);
    }
}

const scdlGrantService = new ScdlGrantService();
export default scdlGrantService;
