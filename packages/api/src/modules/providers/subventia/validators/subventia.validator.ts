import Siret from "../../../../valueObjects/Siret";
import { isNumberValid } from "../../../../shared/Validators";
import { GenericParser } from "../../../../shared/GenericParser";
import SubventiaDto from "../@types/subventia.dto";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { ParsedDataWithProblem, Problem } from "./@types/Validation";

export default class SubventiaValidator {
    static sortDataByValidity(parsedData: SubventiaDto[]) {
        const sortedData = parsedData.reduce<{ valids: SubventiaDto[]; invalids: ParsedDataWithProblem[] }>(
            (acc, currentLine) => {
                const validation = this.isSubventiaDtoValid(currentLine);
                if (validation.valid) {
                    acc["valids"].push(currentLine);
                } else {
                    validation?.problems?.map((pb: Problem) => acc["invalids"].push({ ...currentLine, ...pb }));
                }
                return acc;
            },
            { valids: [], invalids: [] },
        );
        sortedData.invalids = this.formatInvalids(sortedData.invalids);
        return sortedData;
    }

    protected static isSubventiaDtoValid(parsedDataRow: SubventiaDto) {
        const problems: Problem[] = [];
        let valid = true;

        this.typesRequirements.forEach(requirement => {
            if (requirement.test(parsedDataRow[requirement.key])) {
                const coherenceRequirement = this.coherenceRequirements.find(
                    coherenceRequirement => coherenceRequirement.key === requirement.key,
                );
                if (coherenceRequirement && !coherenceRequirement.test(parsedDataRow)) {
                    problems.push({
                        field: coherenceRequirement.key,
                        value: parsedDataRow[coherenceRequirement.key],
                        message: coherenceRequirement.message,
                    });
                    valid = false;
                } else return;
            } else {
                problems.push({
                    field: requirement.key,
                    value: parsedDataRow[requirement.key],
                    message: requirement.message,
                });
                valid = false;
            }
        });

        if (problems.length) return { valid, problems };
        return { valid };
    }

    protected static typesRequirements: {
        key: string;
        test: (v: unknown) => boolean;
        message: string;
    }[] = [
        { key: "SIRET - Demandeur", test: v => Siret.isSiret(v as string), message: "SIRET manquant ou invalid" },
        {
            key: "Date - Décision",
            test: v => {
                if (v) {
                    try {
                        GenericParser.ExcelDateToJSDate(parseInt(v as string, 10));
                    } catch (e) {
                        return false;
                    }
                    return isValidDate(GenericParser.ExcelDateToJSDate(parseInt(v as string, 10)));
                }
                return true;
            },
            message: "Date - Décision n'est pas valid",
        },
        {
            key: "Montant voté TTC - Décision",
            test: v => isNumberValid(v as number) || !v,
            message: "Montant voté TTC - Décision n'est pas un nombre",
        },
        { key: "Montant Ttc", test: v => isNumberValid(v as number) || !v, message: "Montant Ttc n'est pas un nombre" },
        {
            key: "Référence administrative - Demande",
            test: v => v !== null,
            message: "Référence demande null n'est pas une donnée acceptée",
        },
    ];

    protected static coherenceRequirements: {
        key: string;
        test: (v: SubventiaDto) => boolean;
        message: string;
    }[] = [
        {
            key: "Date - Décision",
            test: v =>
                !v["Date - Décision"] ||
                GenericParser.ExcelDateToJSDate(parseInt(v["Date - Décision"] as string, 10)).getUTCFullYear() >=
                    parseInt(v["annee_demande"]),
            message: "La date de la décision ne peut pas être inférieure à la date de la demande",
        },

        {
            key: "Montant voté TTC - Décision",
            test: v =>
                // @ts-expect-error : test invalid data
                (v["Montant voté TTC - Décision"] === "" &&
                    ["VOTE", "SOLDE"].includes(v["Statut - Dossier de financement"])) === false,
            message: "Montant voté TTC - Décision est requis pour les status VOTE et SOLDE",
        },
    ];

    protected static formatDate(ExcelDate: string) {
        const JsonDate = ExcelDate ? GenericParser.ExcelDateToJSDate(parseInt(ExcelDate, 10)) : null;
        if (JsonDate) {
            return JsonDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
        }
        return "";
    }

    protected static formatInvalids(invalids: ParsedDataWithProblem[]) {
        return invalids.map(invalid => {
            return {
                ...invalid,
                "Date - Décision": this.formatDate(invalid["Date - Décision"]),
                "Date limite de début de réalisation": this.formatDate(invalid["Date limite de début de réalisation"]),
                "Date limite de fin de réalisation": this.formatDate(invalid["Date limite de fin de réalisation"]),
                "Date - Visa de recevabilité": this.formatDate(invalid["Date - Visa de recevabilité"]),
            };
        });
    }
}
