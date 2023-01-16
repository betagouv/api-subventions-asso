import fs from "fs";

import { StaticImplements } from "../../../../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../../../../@types";
import FonjepParser from "../../fonjep.parser";
// import { FonjepRowData } from "../../@types/FonjepRawData";
import fonjepService, { CreateFonjepResponse, RejectedRequest } from "../../fonjep.service";
// import FonjepSubventionEntity from "../../entities/FonjepSubventionEntity";
import * as CliHelper from "../../../../../shared/helpers/CliHelper";
import CliController from "../../../../../shared/CliController";
import ExportDateError from "../../../../../shared/errors/cliErrors/ExportDateError";
// import FonjepVersementEntity from "../../entities/FonjepVersementEntity";

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

        const { subventions, versements } = FonjepParser.parse(fileContent, exportDate);

        console.info("Start register in database ...");

        const subventionRejected = [] as RejectedRequest[];

        const subventionsResult = await subventions.reduce(async (acc, subvention, index) => {
            const result = await acc;
            const response = await fonjepService.createSubventionEntity(subvention);

            CliHelper.printProgress(index + 1, subventions.length, "subventions");

            if (!response.success) {
                subventionRejected.push(response);
                return result;
            }

            result.push(response);
            return result;
        }, Promise.resolve([]) as Promise<(RejectedRequest | CreateFonjepResponse)[]>);

        console.info(`
            ${subventionsResult.length} subventions created
            ${subventionRejected.length} subventions not valid
        `);

        subventionRejected.forEach(result => {
            logs.push(
                `\n\nThis subvention is not registered because: ${result.message} \n`,
                JSON.stringify(result.data, null, "\t")
            );
        });

        const versementRejected = [] as RejectedRequest[];

        const versementsResult = await versements.reduce(async (acc, versement, index) => {
            const result = await acc;
            const response = await fonjepService.createVersementEntity(versement);

            CliHelper.printProgress(index + 1, versements.length, "versements");

            if (!response.success) {
                versementRejected.push(response);
                return result;
            }
            result.push(response);
            return result;
        }, Promise.resolve([]) as Promise<(RejectedRequest | CreateFonjepResponse)[]>);

        console.info(`
            ${versementsResult.length} versements created
            ${versementRejected.length} versements not valid
        `);

        versementRejected.forEach(result => {
            logs.push(
                `\n\nThis versement is not registered because: ${result.message} \n`,
                JSON.stringify(result.data, null, "\t")
            );
        });
    }

    // private isSameVersementsDocument(previousVersements: FonjepVersementEntity[], newVersements: FonjepVersementEntity[]) {
    //     return previousVersements.every(previousVersement => {
    //         return newVersements.find(newVersement => {
    //             return newVersement.indexedInformations.periode_debut.getTime() === previousVersement.indexedInformations.periode_debut.getTime()
    //         });
    //     });
    // }

    // Check if a document is missing in new FONJEP file (assuming code + annee is a unique_id)
    // private isSameDocument(previousData: FonjepRowData, newData: FonjepRowData) {
    //     // @ts-expect-error: data unknown
    //     const matchSubvention = previousData.subvention.data.Code === newData.subvention.data.Code;

    //     if (!matchSubvention) return matchSubvention;

    //     const matchVersements = this.isSameVersementsDocument(previousData.versements, newData.versements);
    //     return matchVersements;
    // }

    // private splitEntitiesByYear(data) {
    //     function reduceSubventionByYear(acc, curr) {
    //         const year = curr.subvention.indexedInformations.annee_demande;
    //         if (!acc[year]) acc[year] = [];
    //         acc[year].push(curr);
    //         return acc;
    //     }
    //     const sortedData = data.reduce(reduceSubventionByYear, {});
    //     return sortedData as DefaultObject<{ subvention: FonjepSubventionEntity, versements: FonjepVersementEntity[] }[]>;
    // }

    // Check if previous export documents are in new export file
    // For now user need to be sure that xls tabs are identical (currently no check of tabs content)
    // public async _compare(previousFile: string, newFile: string) {
    //     console.log("start parsing files...");

    //     const today = new Date();
    //     const previousFileContent = fs.readFileSync(previousFile);
    //     // THOUGHTS: maybe make a light version of parser to only return subvention and not versement to optimize?
    //     // Or maybe it should be comparing versement too
    //     const previousData = FonjepParser.parse(previousFileContent, today);
    //     const newFileContent = fs.readFileSync(newFile);
    //     const newData = FonjepParser.parse(newFileContent, today);

    //     const sortedNewData = this.splitEntitiesByYear(newData);
    //     let loop = true;
    //     let counter = 0;
    //     let noMissingDocument = true;
    //     console.log("start comparing files...");

    //     // Sort entity by date to increase performance
    //     while (loop && noMissingDocument) {
    //         const currentData = previousData[counter];
    //         CliHelper.printAtSameLine(String(counter));

    //         const currentYear = currentData.subvention.indexedInformations.annee_demande;

    //         const match = sortedNewData[currentYear]?.find(data => this.isSameDocument(currentData, data));
    //         if (!match) {
    //             noMissingDocument = false;
    //         }
    //         counter++
    //         if (counter == previousData.length) loop = false;
    //     }
    //     if (noMissingDocument) console.log("GREAT ! No missing document in the new file, we can drop and insert");
    //     else console.log("ARGFFF..! Some documents are missing so we have to find and update...");
    //     return noMissingDocument;
    // }

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
