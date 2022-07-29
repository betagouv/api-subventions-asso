import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface, DefaultObject } from "../../../../../@types";
import FonjepParser from "../../fonjep.parser";
import fonjepService, { RejectedRequest } from "../../fonjep.service";
import FonjepRequestEntity from "../../entities/FonjepRequestEntity";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import CliController from '../../../../../shared/CliController';
import ExportDateError from '../../../../../shared/errors/cliErrors/ExportDateError';

@StaticImplements<CliStaticInterface>()
export default class FonjepCliController extends CliController {
    static cmdName = "fonjep";

    protected logFileParsePath = "./logs/fonjep.parse.log.txt";

    // Called in CliController parse()
    protected async _parse(file: string, logs: unknown[], exportDate: Date) {
        if (!exportDate) throw new ExportDateError();
        console.info("\nStart parse file: ", file);
        logs.push(`\n\n--------------------------------\n${file}\n--------------------------------\n\n`);

        const fileContent = fs.readFileSync(file);

        const entities = FonjepParser.parse(fileContent, exportDate);

        console.info("Start register in database ...")

        const results = await entities.reduce(async (acc, entity, index) => {
            const data = await acc;
            CliHelper.printProgress(index + 1, entities.length)
            data.push(await fonjepService.createEntity(entity));
            return data;
        }, Promise.resolve([]) as Promise<
            ({
                success: true,
                state: string
            }
                | RejectedRequest)[]>)

        const created = results.filter((result) => result.success && result.state === "created");
        const updated = results.filter((result) => result.success && result.state === "updated");
        const rejected = results.filter((result) => !result.success) as RejectedRequest[];

        console.info(`
            ${results.length}/${entities.length}
            ${created.length} requests created and ${updated.length} requests updated
            ${rejected.length} requests not valid
        `);

        rejected.forEach((result) => {
            logs.push(`\n\nThis request is not registered because: ${result.message}\n`, JSON.stringify(result.data, null, "\t"))
        });
    }

    // Check if previous export documents are in new export file
    public async _compare(previousFile: string, newFile: string) {
        console.log("start parsing files...");

        const today = new Date();
        const previousFileContent = fs.readFileSync(previousFile);
        const previousEntities = FonjepParser.parse(previousFileContent, today);
        const newFileContent = fs.readFileSync(newFile);
        const newEntities = FonjepParser.parse(newFileContent, today);

        // check nb of document

        let loop = true;
        let counter = 0;
        let noMissingDocument = true;
        console.log("start comparing files...");

        function splitEntitiesByYear(array: FonjepRequestEntity[]) {
            function reduceEntities(obj: DefaultObject<FonjepRequestEntity[]>, entity: FonjepRequestEntity) {
                const year = entity.indexedInformations.annee_demande;
                if (!obj[year]) obj[year] = [];
                obj[year].push(entity);
                return obj;
            }

            return array.reduce(reduceEntities, {})
        }

        // Check if a document is missing in new FONJEP file (assuming code + annee is a unique_id)
        function isSameDocument(previousEntity: FonjepRequestEntity, newEntity: FonjepRequestEntity) {
            // @ts-expect-error: data unknow type
            return previousEntity.data.Code === newEntity.data.Code
        }

        // Sort entity by date to increase performance
        const sortedNewEntities: DefaultObject<FonjepRequestEntity[]> = splitEntitiesByYear(newEntities);
        while (loop && noMissingDocument) {
            const currentEntity = previousEntities[counter];
            CliHelper.printAtSameLine(String(counter));

            const currentYear = currentEntity.indexedInformations.annee_demande;

            const match = sortedNewEntities[currentYear]?.find(newEntity => isSameDocument(currentEntity, newEntity));
            if (!match) {
                noMissingDocument = false;
            }
            counter++
            if (counter == previousEntities.length) loop = false;
        }
        if (noMissingDocument) console.log("GREAT ! No missing document in the new file, we can drop and insert");
        else console.log("ARGFFF..! Some documents are missing so we have to find and update...");
        return noMissingDocument;
    }

    public async drop() {
        await fonjepService.dropCollection();
    }

    public async rename(newTableName: string | undefined) {
        if (!newTableName) {
            throw new Error("newTableName arguments is missing");
        }

        await fonjepService.renameCollection(newTableName);
    }
}