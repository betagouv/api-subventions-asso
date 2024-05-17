import * as ParseHelper from "../../../shared/helpers/ParserHelper";

//import ILegalInformations from "../../search/@types/ILegalInformations";
//import { SubventiaRequestEntity } from "./entities/SubventiaRequestEntity";
//import ISubventiaIndexedInformation from "./@types/ISubventiaIndexedInformation";

// Ici dans mon parse je ne spécifie pas le type de retour de la fonction parse, je laisse typescript inférer le type de retour

/* Traitements à faire : 
        - group by par Référence administrative - Demande
        - renommer Financeur Principal en service instructeur
        - 

        */

export default class SubventiaParser {
    static parse(fileContent: Buffer) {
        console.log("Open and read file ...");
        const data = ParseHelper.xlsParse(fileContent)[0];
        const headers = data[0] as string[];
        console.log("Map rows to entities...");

        const parsedData = data.slice(1).map(row => ParseHelper.linkHeaderToData(headers, row));

        return this.getApplications(parsedData);
    }

    protected static groupByApplication<T>(parsedData: T[]) {
        const groupKey = "Référence administrative - Demande";
        return parsedData.reduce((acc, currentLine: T) => {
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(currentLine);
            return acc;
        }, {});
    }

    protected static mergeToApplication(applicationLines: any[]) {
        const amountKey = "Montant Ttc";
        return applicationLines.reduce((mainLine: Record<string, any>, currentLine: Record<string, any>) => {
            mainLine[amountKey] = Number(mainLine[amountKey]) + Number(currentLine[amountKey]);
            return mainLine;
        });
    }

    protected static getApplications(parsedData) {
        const grouped = this.groupByApplication(parsedData);

        const groupedLinesArr: any[][] = Object.values(grouped);
        const applications = groupedLinesArr.map((groupedLine: any[]) => {
            return this.mergeToApplication(groupedLine);
        });
        return applications;
    }
}

/* Interrogation à aborder! Comment on stock les données cette fois compte tenu que nous avons pas le
même nombre de lignes dans les données brutes et les données traitées ? 
*/
/*
    protected static rowsToEntities(headers, rows) {
        return rows.reduce((entities, row, index, array) => {
            const data = ParseHelper.linkHeaderToData(headers, row);
            const indexedInformations = ParseHelper.indexDataByPathObject(
                ChorusLineEntity.indexedInformationsPath,
                data,
            ) as unknown as IChorusIndexedInformations;

            if (!this.isIndexedInformationsValid(indexedInformations)) return entities;

            const uniqueId = this.buildUniqueId(indexedInformations);
            entities.push(new ChorusLineEntity(uniqueId, indexedInformations, data));

            CliHelper.printAtSameLine(`${index} entities parsed of ${array.length}`);

            return entities;
        }, []);
    }
   */
