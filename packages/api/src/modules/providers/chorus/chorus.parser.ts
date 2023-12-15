import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import * as CliHelper from "../../../shared/helpers/CliHelper";
import { BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import { isSiret, isEJ } from "../../../shared/Validators";
import { getMD5 } from "../../../shared/helpers/StringHelper";
import ChorusLineEntity from "./entities/ChorusLineEntity";
import IChorusIndexedInformations from "./@types/IChorusIndexedInformations";

export default class ChorusParser {
    static parse(content: Buffer) {
        console.log("Open and read file ...");
        const pages = ParseHelper.xlsParse(content);
        console.log("Read file end");

        const page = pages[0];

        const headerRow = page[0] as string[];
        const headers = ChorusParser.renameEmptyHeaders(headerRow);
        console.log("Map rows to entities...");
        const entities = this.rowsToEntities(headers, page.slice(1));
        return entities;
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

    protected static buildUniqueId(info: IChorusIndexedInformations) {
        const {
            ej,
            siret,
            dateOperation,
            amount,
            numeroDemandePayment,
            codeCentreFinancier,
            codeDomaineFonctionnel,
            codeActivitee,
        } = info;
        return getMD5(
            `${ej}-${siret}-${dateOperation.toISOString()}-${amount}-${numeroDemandePayment}-${codeCentreFinancier}-${codeDomaineFonctionnel}-${codeActivitee}`,
        );
    }

    protected static validateIndexedInformations(indexedInformations) {
        if (!BRANCHE_ACCEPTED[indexedInformations.codeBranche]) {
            throw new Error(`The branch ${indexedInformations.codeBranche} is not accepted in data`);
        }

        // special treatment for siret with # that represents departments which didn't use SIRET but another identifier
        if (!isSiret(indexedInformations.siret) && indexedInformations.siret !== "#") {
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
