import * as CliHelper from "../../../shared/helpers/CliHelper";
import { BRANCHE_ACCEPTED } from "../../../shared/ChorusBrancheAccepted";
import { isEJ } from "../../../shared/Validators";
import { getMD5 } from "../../../shared/helpers/StringHelper";
import Siret from "../../../identifierObjects/Siret";
import { GenericParser } from "../../../shared/GenericParser";
import ChorusEntity from "./entities/ChorusEntity";
import ChorusFseEntity from "./entities/ChorusFseEntity";
import { ChorusFseMapper } from "./mappers/chorus.fse.mapper";
import { ChorusDto } from "./@types/ChorusDto";
import { santitizeFloat } from "../../../shared/helpers/NumberHelper";

export default class ChorusParser {
    static parse(content: Buffer) {
        const NATIONAL_PAGE_NAME = "1. Extraction";
        const EUROPEAN_PAGE_NAME = "2. Extraction FEHBE";

        console.log("Open and read file ...");
        const pagesWithName = GenericParser.xlsxParse<string>(content);
        console.log("Read file end");

        const nationalData = pagesWithName.find(page => page.name === NATIONAL_PAGE_NAME)?.data;
        if (!nationalData) {
            throw new Error("No national data found in the file, please check if page name as changed.");
        }

        const nationalEntities = this.nationalDataToEntities(this.getHeadersAndRows(nationalData));
        const europeanData = pagesWithName.find(page => page.name === EUROPEAN_PAGE_NAME)?.data;
        if (!europeanData) {
            throw new Error("No european data found in the file, please check if page name as changed.");
        }
        const europeanEntities = this.europeanDataToEntities(this.getHeadersAndRows(europeanData));
        return { national: nationalEntities, european: europeanEntities };
    }

    private static getHeadersAndRows(data: string[][]) {
        return { headers: ChorusParser.renameEmptyHeaders(data[0]), rows: data.slice(1) };
    }

    // CHORUS exports have "double columns" sharing the same header (only the header for the first column is defined)
    // Because it is most of the time a code followed by its corresponding label we replace the header by two distinct headers :
    // LABEL + CODE | LABEL
    private static renameEmptyHeaders(headerRow) {
        const header: string[] = [];
        for (let i = 0; i < headerRow.length; i++) {
            // if header not defined, we take the previous one
            if (!headerRow[i]) {
                const name = header[i - 1] as string;

                // special case - the adjacent column is the structure name
                if (name === "Fournisseur payé (DP)") {
                    header.push("Désignation de la structure");
                } else {
                    // add CODE suffix to the first header
                    header[i - 1] = `${name} CODE`;
                    // rename empty header from the previous header
                    header.push(name.replace("&#32;", " ").trim());
                }
            } else {
                header.push(headerRow[i].replace(/&#32;/g, " ").trim());
            }
        }
        return header;
    }

    private static europeanDataToEntities(data: { headers: string[]; rows: string[][] }) {
        const { headers, rows } = data;
        return rows.reduce((entities, row) => {
            const dto = GenericParser.linkHeaderToData(headers, row) as unknown as ChorusDto;
            let entity: ChorusFseEntity;
            try {
                entity = ChorusFseMapper.dtoToEntity(dto);
            } catch (e) {
                console.log(
                    `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                    JSON.stringify(dto, null, "\t"),
                );
                return entities;
            }

            entities.push(entity);

            return entities;
        }, [] as ChorusFseEntity[]);
    }

    private static nationalDataToEntities(data: { headers: string[]; rows: string[][] }) {
        const { headers, rows } = data;
        return rows.reduce((entities, row, index, array) => {
            const chorusDto = GenericParser.linkHeaderToData(headers, row) as ChorusDto;

            const entity = this.dtoToEntity(chorusDto);
            try {
                this.validateEntity(entity);
            } catch (e) {
                console.log("CATCH !");
                console.log(
                    `\n\nThis request is not registered because: ${(e as Error).message}\n`,
                    JSON.stringify(chorusDto, null, "\t"),
                );
                return entities;
            }

            entities.push(entity);

            CliHelper.printAtSameLine(`${index + 1} entities parsed of ${array.length}`);

            return entities;
        }, [] as ChorusEntity[]);
    }

    private static buildEntityFromDto(dto: ChorusDto): Omit<ChorusEntity, "uniqueId"> {
        // @TODO: check if numPosteDP and numPosteEJ are number after parse
        return {
            ej: dto["N° EJ"],
            numPosteEJ: Number(dto["N° poste EJ"]),
            siret: dto["Code taxe 1"],
            ridetOrTahitiet: dto["No TVA 3 (COM-RIDET ou TAHITI)"],
            codeBranche: dto["Branche CODE"],
            branche: dto["Branche"],
            activitee: dto["Référentiel de programmation"],
            codeActivitee: dto["Référentiel de programmation CODE"],
            numeroDemandePaiement: dto["N° DP"],
            numPosteDP: Number(dto["N° poste DP"]),
            codeSociete: dto["Société"],
            exercice: santitizeFloat(dto["Exercice comptable"]),
            numeroTier: dto["Fournisseur payé (DP)"],
            nomStructure: dto["Désignation de la structure"],
            centreFinancier: dto["Centre financier"],
            codeCentreFinancier: dto["Centre financier CODE"],
            domaineFonctionnel: dto["Domaine fonctionnel"],
            codeDomaineFonctionnel: dto["Domaine fonctionnel CODE"],
            amount: santitizeFloat(dto["EUR"] ?? dto["Montant payé"]),
            dateOperation: GenericParser.getDateFromXLSX(dto["Date de dernière opération sur la DP"]),
            updateDate: new Date(),
        };
    }

    public static dtoToEntity(dto: ChorusDto): ChorusEntity {
        const partialEntity = this.buildEntityFromDto(dto);
        return {
            uniqueId: this.buildUniqueId(partialEntity),
            ...partialEntity,
        };
    }

    private static buildUniqueId(partialEntity: Omit<ChorusEntity, "uniqueId">) {
        const { ej, numPosteEJ, numeroDemandePaiement, exercice, codeSociete, numPosteDP } = partialEntity;
        return getMD5(`${ej}-${numPosteEJ}-${numeroDemandePaiement}-${numPosteDP}-${codeSociete}-${exercice}`);
    }

    /**
     * Checks for mandatory fields used to build unique ID
     */
    private static hasMandatoryFields(entity: ChorusEntity) {
        const missingFields: string[] = [];

        // those fields are "mandatory" because they are used to build the unique ID
        const mandatoryFields = ["ej", "numPosteEJ", "numeroDemandePaiement", "numPosteDP", "codeSociete", "exercice"];
        for (const key of mandatoryFields) {
            if (!entity[key]) missingFields.push(key);
        }
        if (missingFields.length) {
            return false;
        } else return true;
    }

    private static validateEntity(entity: ChorusEntity) {
        const hasUniqueFields = this.hasMandatoryFields(entity);
        if (!hasUniqueFields) throw new Error("The entity is missing mandatory fields");

        // special treatment for siret with # that represents departments which didn't use SIRET but another identifier
        if (!Siret.isSiret(entity.siret) && entity.siret !== "#") {
            throw new Error(`Invalid SIRET: ${entity.siret}`);
        }

        if (!isEJ(entity.ej)) {
            throw new Error(`Invalid EJ: ${entity.ej}`);
        }

        if (!BRANCHE_ACCEPTED[entity.codeBranche]) {
            throw new Error(`The branch ${entity.codeBranche} is not accepted`);
        }

        if (isNaN(entity.amount)) {
            throw new Error(`Invalid amount`);
        }

        if (!(entity.dateOperation instanceof Date)) {
            throw new Error(`Invalid operation date`);
        }

        return true;
    }
}
