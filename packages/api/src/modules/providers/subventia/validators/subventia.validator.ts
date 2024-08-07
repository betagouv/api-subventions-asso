import { ExcelDateToJSDate } from "../../../../shared/helpers/ParserHelper";
import Siret from "../../../../valueObjects/Siret";
import SubventiaDto from "../@types/subventia.dto";

export default class SubventiaValidator {
    static sortDataByValidity(parsedData: SubventiaDto[]) {
        const sortedData = parsedData.reduce<{ valids: SubventiaDto[]; invalids: SubventiaDto[] }>(
            (acc, currentLine) => {
                if (this.isDataRowTypesValid(currentLine) && this.isDataRowCoherenceValid(currentLine)) {
                    acc["valids"].push(currentLine);
                } else {
                    acc["invalids"].push(currentLine);
                }
                return acc;
            },
            { valids: [], invalids: [] },
        );
        return sortedData;
    }

    static validateDataRowTypes(parsedDataRow: SubventiaDto) {
        if (!Siret.isSiret(parsedDataRow["SIRET - Demandeur"])) {
            throw new Error(`INVALID SIRET FOR ${parsedDataRow["SIRET - Demandeur"]}`);
        }

        if (parsedDataRow["Date - Décision"]) {
            try {
                ExcelDateToJSDate(parseInt(parsedDataRow["Date - Décision"], 10));
            } catch (e) {
                throw new Error(`Date - Décision is not a valid date`);
            }
        }

        if (parsedDataRow["Montant voté TTC - Décision"]) {
            if (isNaN(parsedDataRow["Montant voté TTC - Décision"])) {
                throw new Error(`Montant voté TTC - Décision is not a number`);
            }
        }

        if (parsedDataRow["Montant Ttc"]) {
            if (isNaN(parsedDataRow["Montant Ttc"])) {
                throw new Error(`Montant Ttc is not a number`);
            }
        }

        return true;
    }

    static validateDataRowCoherence(parsedDataRow: SubventiaDto) {
        if (!parsedDataRow["Référence administrative - Demande"]) {
            throw new Error(`Référence demande null is not accepted in data`);
        }

        if (parsedDataRow["Date - Décision"]) {
            if (
                ExcelDateToJSDate(parseInt(parsedDataRow["Date - Décision"])).getUTCFullYear() <
                parseInt(parsedDataRow["annee_demande"])
            ) {
                throw new Error(`The year of the decision cannot be lower than the year of the request`);
            }
        }

        return true;
    }

    protected static isDataRowTypesValid(parsedDataRow: SubventiaDto) {
        try {
            return this.validateDataRowTypes(parsedDataRow);
        } catch (e) {
            console.log(
                `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                JSON.stringify(parsedDataRow, null, "\t"),
            );
            return false;
        }
    }

    protected static isDataRowCoherenceValid(parsedDataRow: SubventiaDto) {
        try {
            return this.validateDataRowCoherence(parsedDataRow);
        } catch (e) {
            console.log(
                `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                JSON.stringify(parsedDataRow, null, "\t"),
            );
            return false;
        }
    }
}
