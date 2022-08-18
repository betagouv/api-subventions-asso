import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../../../@types/Cli.interface";
import DataGouvParser from "../../datagouv.parser";
import dataGouvService from "../../datagouv.service";
import EntrepriseSirenEntity from "../../entities/EntrepriseSirenEntity";
import RnaSiren from "../../../../open-data/rna-siren/entities/RnaSirenEntity";
import { IStreamAction } from "../../@types";
import rnaSirenService from "../../../../open-data/rna-siren/rnaSiren.service";
import CliController from '../../../../../shared/CliController';

@StaticImplements<CliStaticInterface>()
export default class DataGouvCliController extends CliController {
    static cmdName = "datagouv";

    protected logFileParsePath = "./logs/datagouv.parse.log.txt"

    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
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

        await dataGouvService.addNewImport({
            filename: file,
            dateOfFile: exportDate,
            dateOfImport: new Date()
        })
    }
}