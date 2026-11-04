import fs from "fs";
import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import omogenAdapter, { OmogenAdapter } from "../../outputs/api/omogen/omogen.adapter";

@StaticImplements<CliStaticInterface>()
export default class OmogenCli {
    static cmdName = "omogen";

    constructor(private adapter: OmogenAdapter) {}

    // used for local test only
    async list() {
        const list = await this.adapter.list();
        console.log(list);
        return list;
    }

    async auth() {
        // @ts-expect-error: call private method for test
        return this.adapter.auth();
    }

    async get(id: string) {
        await this.adapter.get(id);
    }

    async test(path) {
        await this.auth();
        await this.upload(path);
        const list = await this.list();
        const id = list[0].correlationID;
        await this.get(id);
    }

    // @TODO: remove this when the connection will be set in production
    async upload(path) {
        const stream = fs.createReadStream(path);
        // @ts-expect-error: call private method
        await this.adapter.upload(stream);
    }
}

export const createOmogenCli = () => new OmogenCli(omogenAdapter);
