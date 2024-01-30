import fs from "fs";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";
import dumpService from "../../modules/dump/dump.service";
import DumpPipedriveParser from "../../modules/dump/dump.pipedrive.parser";

@StaticImplements<CliStaticInterface>()
export default class DumpCli {
    static cmdName = "dump";

    public publishStatsData() {
        return dumpService.publishStatsData();
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
        return dumpService.importPipedriveData(DumpPipedriveParser.parse(fileContent));
    }
}
