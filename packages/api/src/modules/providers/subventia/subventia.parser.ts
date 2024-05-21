import * as ParseHelper from "../../../shared/helpers/ParserHelper";

import { isSiret } from "../../../shared/Validators";

import { ExcelDateToJSDate } from "../../../shared/helpers/ParserHelper";
import SubventiaLineEntity from "./entities/SubventiaLineEntity";

//import ISubventiaIndexedInformation from "./@types/ISubventiaIndexedInformation";

/* still to do :
 0) Est-ce que les valeurs associés à un status sont uniformisé entre les differentes sources de données ?
 1) validate application in
 2) validate indexed informations



*/
export default class SubventiaParser {
    static parse(fileContent: Buffer) {
        console.log("Open and read file ...");
        const data = ParseHelper.xlsParse(fileContent)[0];
        const headers = data[0] as string[];
        console.log("Map rows to entities...");

        const parsedData = data.slice(1).map(row => ParseHelper.linkHeaderToData(headers, row));

        const applications = this.getApplications(parsedData);
        return applications;
    }

    protected static groupByApplication<T>(parsedData: T[]) {
        const groupKey = "Référence administrative - Demande";
        return parsedData.reduce((acc, currentLine: T) => {
            if (!acc[currentLine[groupKey]]) {
                acc[currentLine[groupKey]] = [];
            }
            acc[currentLine[groupKey]].push(currentLine);
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
        // expliquer comment ça marche
        const grouped = this.groupByApplication(parsedData);

        const groupedLinesArr: any[][] = Object.values(grouped);
        const applications = groupedLinesArr.map((groupedLine: any[]) => {
            const application = this.mergeToApplication(groupedLine);
            const entity = this.applicationToEntity(application);
            return {
                ...entity,
                __data__: groupedLine,
            }; //
        });
        return applications;
    }

    protected static applicationToEntity(application) {
        return ParseHelper.indexDataByPathObject(
            SubventiaLineEntity.indexedInformationsPath,
            application,
        ) as unknown as SubventiaLineEntity;
    }

    protected static validateEntityInformations(entity) {
        if (!entity.reference_demande) {
            throw new Error(`Reference demande null is not accepted in data`);
        }

        if (entity.date_commision) {
            if (entity.annee_commision.getFullYear() < parseInt(entity.annee_demande, 10)) {
                throw new Error(`The year of the decision cannot be lower than the year of the request`);
            }
        }

        if (!isSiret(entity.siret)) {
            throw new Error(`INVALID SIRET FOR ${entity.siret}`);
        }

        if (entity.annee_commision) {
            if (!(entity.annee_commision instanceof Date)) {
                throw new Error(`anne_commision is not a valid date`);
            }
        }

        if (entity.montants_accorde) {
            if (isNaN(entity.montants_accorde)) {
                throw new Error(`montants_accorde is not a number`);
            }
        }

        if (entity.montants_demande) {
            if (isNaN(entity.montants_demande)) {
                throw new Error(`montants_demande is not a number`);
            }
        }
        return true;
    }

    protected static isEntityInformationsValid(EntityInformations: SubventiaLineEntity) {
        try {
            return this.validateEntityInformations(EntityInformations);
        } catch (e) {
            console.log(
                `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                JSON.stringify(EntityInformations, null, "\t"),
            );
            return false;
        }
    }
}
