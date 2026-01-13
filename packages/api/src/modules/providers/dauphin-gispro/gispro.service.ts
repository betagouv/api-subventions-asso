import GisproParser from "./gispro.parser";
import gisproPort from "../../../dataProviders/db/providers/gispro.port";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import Provider from "../@types/IProvider";

export class GisproService implements Provider {
    meta = {
        name: "GISPRO",
        type: ProviderEnum.raw,
        description: "Outil interne à l'ANCT pour récupérer, aggréger et traiter les données DAUPHIN",
        id: "gispro",
    };

    async parseSaveXls(fileContent: Buffer<ArrayBufferLike>, exercise: number) {
        const entities = GisproParser.parse(fileContent, exercise);

        console.log(entities.length + " entities founds");
        console.log("Start save entities");

        await gisproPort.insertMany(entities);

        console.log("\nEntities has been saved");
    }
}

const gisproService = new GisproService();
export default gisproService;
