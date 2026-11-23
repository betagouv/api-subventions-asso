import fs from "fs";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import { CliStaticInterface } from "../../../@types";
import DumpPipedriveParser from "../../../modules/dump/dump.pipedrive.parser";
import { metabaseDumpService } from "../../../init-services";
import type AsyncUseCase from "../../../@types/use-case/AsyncUseCase";

@StaticImplements<CliStaticInterface>()
export default class DumpCli {
    static cmdName = "dump";

    constructor(private publishLogs: AsyncUseCase<void, void>) {}

    public publishStatsData() {
        return metabaseDumpService.publishStatsData();
    }

    public publishPosthogLogs() {
        return this.publishLogs.execute();
    }

    public importPipedriveData(file: string) {
        if (typeof file !== "string") {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        console.info("\nStart parse file: ", file);

        const fileContent = fs.readFileSync(file);
        return metabaseDumpService.importPipedriveData(DumpPipedriveParser.parse(fileContent));
    }
}
