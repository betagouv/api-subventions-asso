import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface, DefaultObject } from "../../../../../@types";
import FonjepParser, { FonjepRowData } from "../../fonjep.parser";
import fonjepService, { CreateFonjepResponse, RejectedRequest } from "../../fonjep.service";
import FonjepSubventionEntity from "../../entities/FonjepSubventionEntity";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import CliController from '../../../../../shared/CliController';
import ExportDateError from '../../../../../shared/errors/cliErrors/ExportDateError';
import FonjepVersementEntity from "../../entities/FonjepVersementEntity";

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

        const parsedData = FonjepParser.parse(fileContent, exportDate);

        console.info("Start register in database ...")

        let subventionCreated = 0, versementSuccess = 0;
        const subventionRejected = [] as RejectedRequest[];
        const versementRejected = [] as RejectedRequest[];

        const results = await parsedData.reduce(async (acc, data, index) => {
            const result = await acc;
            const responses = { subvention: await fonjepService.createSubventionEntity(data.subvention), versements: [] as CreateFonjepResponse[] };

            CliHelper.printProgress(index + 1, parsedData.length);

            if (responses.subvention.success) {
                subventionCreated++;
                data.versements.forEach(async versement => {
                    const response = await fonjepService.createVersementEntity(versement);
                    if (response.success) versementSuccess++;
                    else versementRejected.push(response);
                    responses.versements.push(response);
                });
            } else subventionRejected.push(responses.subvention);

            result.push(responses);
            return result;
        }, Promise.resolve([]) as Promise<reduceSubventionsType[]>);

        interface reduceSubventionsType {
            subvention: RejectedRequest | CreateFonjepResponse,
            versements: (RejectedRequest | CreateFonjepResponse)[]
        }

        console.info(`
            ${results.length} / ${parsedData.length}
            ${subventionCreated} subvention created with ${versementSuccess} versement created and ${versementRejected.length} not valid
            ${subventionRejected.length} requests not valid
        `);

        subventionRejected.forEach((result) => {
            logs.push(`\n\nThis request is not registered because: ${result.message} \n`, JSON.stringify(result.data, null, "\t"))
        });
    }

    // Check if previous export documents are in new export file
    // For now user need to be sure that xls tabs are identical (currently no check of tabs content)
    public async _compare(previousFile: string, newFile: string) {
        console.log("start parsing files...");

        const today = new Date();
        const previousFileContent = fs.readFileSync(previousFile);
        // THOUGHTS: maybe make a light version of parser to only return subvention and not versement to optimize?
        // Or maybe it should be comparing versement too
        const previousData = FonjepParser.parse(previousFileContent, today);
        const newFileContent = fs.readFileSync(newFile);
        const newData = FonjepParser.parse(newFileContent, today);

        function splitEntitiesByYear(data) {
            function reduceSubventionByYear(acc, curr) {
                const year = curr.subvention.indexedInformations.annee_demande;
                if (!acc[year]) acc[year] = [];
                acc[year].push(curr);
                return acc;
            }
            const sortedData = data.reduce(reduceSubventionByYear, {});
            return sortedData as DefaultObject<{ subvention: FonjepSubventionEntity, versements: FonjepVersementEntity[] }[]>;
        }

        // Check if a document is missing in new FONJEP file (assuming code + annee is a unique_id)
        function isSameDocument(previousData: FonjepRowData, newData: FonjepRowData) {
            // @ts-expect-error: data unknow type
            const matchSubvention = previousData.subvention.data.Code === newData.subvention.data.Code
            if (matchSubvention) {
                const matchVersements = isSameVersementsDocument(previousData.versements, newData.versements)
                return matchVersements;
            } else return matchSubvention;
        }

        function isSameVersementsDocument(previousVersements: FonjepVersementEntity[], newVersements: FonjepVersementEntity[]) {
            return previousVersements.reduce(function reduceVersementsAreEqual(acc, curr) {
                if (!acc) return acc;
                const match = newVersements.find(versement => {
                    return versement.indexedInformations.periode_debut.getTime() === curr.indexedInformations.periode_debut.getTime()
                });
                return !!match;
            }, true);
        }

        const sortedNewData = splitEntitiesByYear(newData);
        let loop = true;
        let counter = 0;
        let noMissingDocument = true;
        console.log("start comparing files...");

        // Sort entity by date to increase performance
        while (loop && noMissingDocument) {
            const currentData = previousData[counter];
            CliHelper.printAtSameLine(String(counter));

            const currentYear = currentData.subvention.indexedInformations.annee_demande;

            const match = sortedNewData[currentYear]?.find(data => isSameDocument(currentData, data));
            if (!match) {
                noMissingDocument = false;
            }
            counter++
            if (counter == previousData.length) loop = false;
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