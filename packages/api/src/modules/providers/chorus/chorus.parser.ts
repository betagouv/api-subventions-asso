import * as CliHelper from "../../../shared/helpers/CliHelper";
import { BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import { isEJ } from "../../../shared/Validators";
import { getMD5 } from "../../../shared/helpers/StringHelper";
import { DefaultObject } from "../../../@types";
import Siret from "../../../identifierObjects/Siret";
import { GenericParser } from "../../../shared/GenericParser";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import IChorusIndexedInformations from "./@types/IChorusIndexedInformations";
import { ChorusLineDto } from "./@types/ChorusLineDto";

export default class ChorusParser {
    static parse(content: Buffer) {
        console.log("Open and read file ...");
        const pagesWithName = GenericParser.xlsParseWithPageName(content);
        console.log("Read file end");

        const extractionPage = pagesWithName.find(page => page.name.includes("Extraction"));
        if (!extractionPage?.data) {
            throw new Error("no data in Extraction tab");
        }

        const page = extractionPage.data;

        const headerRow = page[0] as string[];
        const headers = ChorusParser.renameEmptyHeaders(headerRow);
        console.log("Map rows to entities...");
        return this.rowsToEntities(headers, page.slice(1));
    }

    // CHORUS exports have "double columns" sharing the same header (only the header for the first column is defined)
    // Because it is always a code followed by its corresponding label we replace the header by two distinct headers :
    // LABEL + CODE | LABEL
    protected static renameEmptyHeaders(headerRow) {
        const header: string[] = [];
        for (let i = 0; i < headerRow.length; i++) {
            // if header not defined, we take the previous one
            if (!headerRow[i]) {
                const name = header[i - 1] as string;
                // we add CODE at the end of the previous header
                header[i - 1] = `${name} CODE`;
                header.push(name.replace("&#32;", " ").trim());
            } else {
                header.push(headerRow[i].replace(/&#32;/g, " ").trim());
            }
        }
        return header;
    }

    protected static rowsToEntities(headers, rows) {
        return rows.reduce((entities, row, index, array) => {
            const data = GenericParser.linkHeaderToData(headers, row) as DefaultObject<string>; // TODO <string|number>

            const indexedInformations = GenericParser.indexDataByPathObject(
                // TODO <string|number>
                ChorusLineEntity.indexedInformationsPath,
                data,
            ) as unknown as IChorusIndexedInformations;

            if (!this.isIndexedInformationsValid(indexedInformations)) return entities;

            const uniqueId = this.buildUniqueId(indexedInformations);
            entities.push(
                new ChorusLineEntity(uniqueId, new Date(), indexedInformations, data as unknown as ChorusLineDto),
            );

            CliHelper.printAtSameLine(`${index + 1} entities parsed of ${array.length}`);

            return entities;
        }, []);
    }

    protected static buildUniqueId(info: IChorusIndexedInformations) {
        const { ej, numPosteEJ, numeroDemandePaiement, exercice, codeSociete, numPosteDP } = info;
        // TODO: get chorus from enum #3410
        return getMD5(`chorus-${ej}-${numPosteEJ}-${numeroDemandePaiement}-${numPosteDP}-${codeSociete}-${exercice}`);
    }

    protected static hasMandatoryFields(indexedInformations: IChorusIndexedInformations) {
        const missingFields: string[] = [];

        // those fields are "mandatory" because they are used to build the unique ID
        const mandatoryFields = ["ej", "numPosteEJ", "numeroDemandePaiement", "numPosteDP", "codeSociete", "exercice"];
        for (const key of mandatoryFields) {
            if (!indexedInformations[key]) missingFields.push(key);
        }

        if (missingFields.length) {
            return { value: false, hints: missingFields };
        } else return { value: true };
    }

    protected static validateIndexedInformations(indexedInformations) {
        if (!BRANCHE_ACCEPTED[indexedInformations.codeBranche]) {
            throw new Error(`The branch ${indexedInformations.codeBranche} is not accepted in data`);
        }

        const hasUniqueFields = this.hasMandatoryFields(indexedInformations);

        if (!hasUniqueFields.value) {
            throw new Error(`The mandatory field(s) ${hasUniqueFields.hints?.concat(" - ")} are missing `);
        }

        // special treatment for siret with # that represents departments which didn't use SIRET but another identifier
        if (!Siret.isSiret(indexedInformations.siret) && indexedInformations.siret !== "#") {
            throw new Error(`INVALID SIRET FOR ${indexedInformations.siret}`);
        }

        if (isNaN(indexedInformations.amount)) {
            throw new Error(`Amount is not a number`);
        }

        if (!(indexedInformations.dateOperation instanceof Date)) {
            throw new Error(`Operation date is not a valid date`);
        }

        if (!isEJ(indexedInformations.ej)) {
            throw new Error(`INVALID EJ FOR ${indexedInformations.ej}`);
        }

        return true;
    }

    protected static isIndexedInformationsValid(indexedInformations: IChorusIndexedInformations) {
        try {
            return this.validateIndexedInformations(indexedInformations);
        } catch (e) {
            console.log(
                `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                JSON.stringify(indexedInformations, null, "\t"),
            );
            return false;
        }
    }
}
