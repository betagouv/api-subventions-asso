import csvSyncParser = require("csv-parse/sync");
import { isNumberValid } from "../../../shared/Validators";
import { isValidDate } from "../../../shared/helpers/DateHelper";
import Siret from "../../../valueObjects/Siret";
import Rna from "../../../valueObjects/Rna";
import { BeforeAdaptation, DefaultObject, NestedDefaultObject, ParserInfo, ParserPath } from "../../../@types";
import { GenericParser } from "../../../shared/GenericParser";
import { ValueWithPath } from "../../../shared/@types/ValueWithPath";
import { DEV } from "../../../configurations/env.conf";
import { SCDL_MAPPER } from "./scdl.mapper";
import { ScdlStorableGrant } from "./@types/ScdlStorableGrant";
import { ScdlParsedGrant } from "./@types/ScdlParsedGrant";
import { ParsedDataWithProblem, Problem, Validity } from "./@types/Validation";

export default class ScdlGrantParser {
    protected static requirements: {
        key: string;
        test: (v: unknown) => boolean;
        message: string;
        optional?: boolean;
    }[] = [
        {
            key: "associationSiret",
            test: v => Siret.isSiret(v?.toString() ?? ""),
            message: "SIRET manquant ou invalide",
        },
        {
            key: "allocatorSiret",
            test: v => Siret.isSiret(v?.toString() ?? ""),
            message: "SIRET invalide",
            optional: true,
        },
        { key: "amount", test: v => isNumberValid(v as number), message: "Le montant n'est pas un nombre" },
        { key: "exercice", test: v => isNumberValid(v as number), message: "L'exercice n'est pas un nombre" },
        {
            key: "paymentStartDate",
            test: v => !v || isValidDate(v),
            message: "La date de début de paiement est définie mais pas valide",
            optional: true,
        },
        {
            key: "conventionDate",
            test: v => !v || isValidDate(v),
            message: "La date de convention est définie mais pas valide",
            optional: true,
        },
        {
            key: "associationRna",
            test: v => !v || Rna.isRna(v as string),
            message: "Le RNA de l'association est défini mais pas valide",
            optional: true,
        },
        {
            key: "paymentEndDate",
            test: v => !v || isValidDate(v),
            message: "La date de fin de paiement est définie mais pas valide",
            optional: true,
        },
    ];

    protected static isGrantValid(grant: ScdlParsedGrant, originalWithPath: DefaultObject<ValueWithPath>): Validity {
        const problems: Problem[] = [];
        let valid = true;

        ScdlGrantParser.requirements.forEach(requirement => {
            if (requirement.test(grant[requirement.key])) return;
            problems.push({
                field: originalWithPath[requirement.key].keyPath.join("."),
                value: originalWithPath[requirement.key].value,
                message: requirement.message,
            });
            if (!requirement.optional) valid = false;
        });
        if (problems.length) return { valid, problems };
        return { valid };
    }

    protected static cleanOptionalFields(grant: ScdlParsedGrant) {
        ScdlGrantParser.requirements
            .filter(req => req.optional)
            .forEach(req => {
                if (!req.test(grant[req.key])) grant[req.key] = undefined;
            });
        return grant;
    }

    static parseCsv(chunk: Buffer, delimiter = ";", quote: boolean | string = '"') {
        const parsedChunk = csvSyncParser.parse(chunk, {
            columns: (header: string[]): string[] => header.map(h => h.trim()),
            skip_empty_lines: true,
            delimiter,
            trim: true,
            cast: false,
            quote,
            bom: true,
        });

        return ScdlGrantParser.convertValidateData(parsedChunk);
    }

    static parseExcel(content: Buffer, pageName?: string, rowOffset = 0) {
        console.log("Open and read file ...");
        const pagesWithName = GenericParser.xlsParseWithPageName(content);
        console.log("Read file end");

        const extractionPage = pageName ? pagesWithName.find(page => page.name === pageName) : pagesWithName[0];
        if (!extractionPage?.data?.length) throw new Error("no data in required page (default is first page)");

        const page = extractionPage.data;

        const headerRow = page[rowOffset] as string[];
        console.log("Map rows to entities...");
        const data = page.slice(rowOffset + 1).map(row => GenericParser.linkHeaderToData(headerRow, row));
        return ScdlGrantParser.convertValidateData(data);
    }

    protected static convertValidateData(parsedChunk): {
        entities: ScdlStorableGrant[];
        errors: ParsedDataWithProblem[];
    } {
        const storableChunk: ScdlStorableGrant[] = [];
        const invalidEntities: Partial<ScdlStorableGrant>[] = [];
        const errors: ParsedDataWithProblem[] = [];

        ScdlGrantParser.verifyMissingHeaders(SCDL_MAPPER, parsedChunk[0]);

        for (const parsedData of parsedChunk) {
            const {
                entity,
                annotations,
                errors: errorsEntity,
            } = ScdlGrantParser.indexDataByPathAndAnnotate<string, ScdlStorableGrant>(SCDL_MAPPER, parsedData);
            errors.push(...errorsEntity);

            // validates and saves annotated errors
            const validation = this.isGrantValid(entity as ScdlStorableGrant, annotations);
            if (validation.valid) {
                storableChunk.push({ ...this.cleanOptionalFields(entity as ScdlStorableGrant), __data__: parsedData });
            } else {
                invalidEntities.push(entity);
            }
            validation?.problems?.map((pb: Problem) =>
                errors.push({ ...parsedData, ...pb, lineRejected: validation.valid ? "oui" : "non" }),
            );
        }

        if (invalidEntities.length) {
            console.log(`WARNING : ${invalidEntities.length} entities invalid`);
            console.log(`Here some of them: `, invalidEntities.slice(0, 3));
        }

        return { entities: storableChunk, errors };
    }

    /*
    equivalent of GenericParser.indexDataByPathObject but keeping in memory the initial label
    could be extracted to GenericParser but at this point (#2387) it seems overkill
     */
    static indexDataByPathAndAnnotate<TypeIn extends BeforeAdaptation, TypeOut = DefaultObject>(
        pathObject: DefaultObject<ParserPath | ParserInfo<TypeIn>>,
        data: NestedDefaultObject<TypeIn>,
    ) {
        const defaultAdapter = <T>(v: string | number | undefined): unknown => v as T;
        let adapter: (v: TypeIn) => any;
        const errors: ParsedDataWithProblem[] = [];

        const entity: Partial<TypeOut> = {};
        const annotations: Record<string, { value: TypeIn; keyPath: string[] }> = {};
        for (const [key, path] of Object.entries(pathObject)) {
            // finds original value and path then adapt it
            const annotated: ValueWithPath<TypeIn> = GenericParser.findValueAndOriginalKeyByPath<TypeIn>(
                data,
                path,
            ) || { value: "" as TypeIn, keyPath: [] };
            // @ts-expect-error -- ts is scared that adapter may not exist in type
            adapter = path?.adapter || defaultAdapter;
            const adapted = adapter(annotated.value);

            // ensures that adaptation works on given data
            if (annotated.value && (adapted === null || adapted === undefined))
                errors.push({
                    ...data,
                    field: annotated.keyPath.join("."),
                    value: annotated.value,
                    message: "donnée non récupérable",
                    lineRejected: "",
                });

            // saves adapted field in entity ; and original value and path to annotations to give feedback in validation later
            entity[key] = adapter(annotated.value);
            annotations[key] = annotated;
        }
        return { entity, annotations, errors };
    }

    /**
     * USE ONLY FOR SCDL WHERE NESTED COLUMNS ARE NOT POSSIBLE
     *
     * Verifies if any column headers is missing in the file and returns a list of the missing ones.
     * For each missing header, the developer should check if it is a naming issue,
     * and if so, add it to the SCDL mapper to prevent the data from being excluded from processing.
     * @param pathObject
     * @param data
     *
     * @returns void
     */
    static verifyMissingHeaders<TypeIn extends BeforeAdaptation>(
        pathObject: DefaultObject<ParserPath | ParserInfo<TypeIn>>,
        data: NestedDefaultObject<TypeIn>,
    ): void {
        if (DEV) {
            const missingKeys = Object.entries(pathObject)
                .filter(([key, path]) => {
                    const flatMapper = (Array.isArray(path) ? path : path.path).flat();
                    return !flatMapper.some(lib => lib in data);
                })
                .map(([key]) => key);

            if (missingKeys.length > 0) {
                console.log(
                    `⚠️ Missing Headers Detected: ${missingKeys.length} column(s) are missing. Please check the following headers:`,
                );
                console.log(`  - ${missingKeys.join("\n  - ")}`);
            }
        }
    }
}
