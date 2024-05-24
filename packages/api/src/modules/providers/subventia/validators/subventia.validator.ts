import { isSiret } from "../../../../shared/Validators";
import { ExcelDateToJSDate } from "../../../../shared/helpers/ParserHelper";

export default class SubventiaValidator {
    static sortDataByValidity(parsedData: object[]) {
        const sortedData = parsedData.reduce(
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
        console.log(sortedData);
        return sortedData;
    }

    static validateDataRowTypes(parsedDataRow: object) {
        if (!isSiret(parsedDataRow["SIRET - Demandeur"])) {
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

    static validateDataRowCoherence(parsedDataRow: object) {
        if (!parsedDataRow["Référence administrative - Demande"]) {
            throw new Error(`Référence demande null is not accepted in data`);
        }

        if (parsedDataRow["Date - Décision"]) {
            if (
                ExcelDateToJSDate(parseInt(parsedDataRow["Date - Décision"], 10)).getUTCFullYear() <
                parseInt(parsedDataRow["annee_demande"], 10)
            ) {
                throw new Error(`The year of the decision cannot be lower than the year of the request`);
            }
        }

        return true;
    }

    protected static isDataRowTypesValid(parsedDataRow: object) {
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

    protected static isDataRowCoherenceValid(parsedDataRow: object) {
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
