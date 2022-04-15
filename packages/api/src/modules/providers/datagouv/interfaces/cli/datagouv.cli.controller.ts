import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../../@types/Cli.interface";
import { findFiles } from "../../../../../shared/helpers/ParserHelper";
import DataGouvParser from "../../datagouv.parser";
import dataGouvService from "../../datagouv.service";
import EntrepriseSirenEntity from "../../entities/EntrepriseSirenEntity";
import RnaSiren from "../../../../rna-siren/entities/RnaSirenEntity";
import { IStreamAction } from "../../@types";
import rnaSirenService from "../../../../rna-siren/rnaSiren.service";

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController {
    static cmdName = "datagouv";

    private logFileParsePath = "./logs/datagouv.parse.log.txt"

    /**
     * @param file path to file
     */
    public async parse_unite_legal(file: string) {
        if (typeof file !== "string" ) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }

        const files = findFiles(file);

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${this.logFileParsePath}`);
        const logs: unknown[] = [];

        return files.reduce((acc, filePath) => {
            return acc.then(() => this._parse(filePath, logs));
        }, Promise.resolve())
            .then(() => fs.writeFileSync(this.logFileParsePath, logs.join(''), { flag: "w", encoding: "utf-8" }));
    }

    private async _parse(file: string, logs: unknown[]) {
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        let chunksInSave = 0;
        const stackEntreprise: EntrepriseSirenEntity[] = [];
        const stackRnaSiren: RnaSiren[] = [];

        const saveEntity = async (entity: EntrepriseSirenEntity | RnaSiren, streamPause: IStreamAction, streamResume: IStreamAction) => {
            if (entity instanceof EntrepriseSirenEntity) {
                stackEntreprise.push(entity);
            } else {
                stackRnaSiren.push(entity);
            }

            if (stackEntreprise.length < 1000 && stackRnaSiren.length < 1000) return;
            
            streamPause();
            chunksInSave++;

            if (stackEntreprise.length > 1000)  {
                const chunkEntreprise = stackEntreprise.splice(-1000);
                await dataGouvService.insertManyEntrepriseSiren(chunkEntreprise, true);
            }

            if (stackRnaSiren.length > 1000) {
                const chunkRnaSiren = stackRnaSiren.splice(-1000);
                await rnaSirenService.insertMany(chunkRnaSiren);
            }

            chunksInSave--;
            if (chunksInSave === 0) {
                streamResume();
            }
        };


        await DataGouvParser.parseUniteLegal(file, saveEntity);

        if (stackEntreprise.length) {
            await dataGouvService.insertManyEntrepriseSiren(stackEntreprise, true);
        }

        if (stackRnaSiren.length) {
            await rnaSirenService.insertMany(stackRnaSiren);
        }

        console.log("\nSwitch entreprise siren repo ...");
        await dataGouvService.replaceEntrepriseSirenCollection();
        console.log("End switch");

        console.log("Remove duplicate in rna-siren table");
        await rnaSirenService.cleanDuplicate();
        console.log("Rna-Siren table is clean");
    }
}