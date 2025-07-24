import GisproParser from "./gispro.parser";
import gisproPort from "../../../dataProviders/db/providers/gispro.port";

export class GisproService {
    async parseSaveXls(fileContent: Buffer<ArrayBufferLike>, exercise: number) {
        const entities = GisproParser.parse(fileContent, exercise);

        console.log(entities.length + " entities founds");
        console.log("Start save entities");

        await gisproPort.upsertMany(entities);

        console.log("\nEntities has been saved");
    }
}

const gisproService = new GisproService();
export default gisproService;
