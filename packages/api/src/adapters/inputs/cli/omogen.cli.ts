import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import omogenAdapter, { OmogenAdapter } from "../../outputs/api/omogen/omogen.adapter";

import fs from "fs";
// import http from "http";

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
        return this.adapter.auth();
    }

    async get(id: string) {
        const result = await this.adapter.get(id);
        fs.writeFileSync("./test.xlsx", Buffer.from(result));
    }

    async test(path) {
        await this.auth();
        await this.upload(path);
        const list = await this.list();
        const id = list[0].correlationID;
        console.log("ID: ", id);
        await this.get(id);
    }

    // @TODO: remove this when the download has been tested
    async upload(path) {
        const stream = fs.createReadStream(path);
        await this.adapter.upload(stream);
    }
}

export const createOmogenCli = () => new OmogenCli(omogenAdapter);
