import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import Ridet, { RIDET_NAME } from "../../../identifier-objects/Ridet";
import Siret, { SIRET_NAME } from "../../../identifier-objects/Siret";
import { GenericParser } from "../../../shared/GenericParser";
import { DDMMYYYYToUTCDate } from "../../../shared/helpers/DateHelper";

// find if identifier is a disguised Ridet or a native Siret
export function getAssoIdType(identifier: string): typeof SIRET_NAME | typeof RIDET_NAME {
    // disguised ridet starts with 9900 or 99000
    if (identifier.startsWith("9900")) return Ridet.getName();
    return Siret.getName();
}

// transform disguised Ridet into a valid Ridet
export function cleanRidet(osirisRidet: string): string {
    // ridet is 9 or 10 digits. It removes the starting 9900 or 99000 used by osiris to convert ridet into siret
    const ridet = osirisRidet.replace(/^99/, "").replace(/^0+/, "");

    if (!Ridet.isRidet(ridet)) {
        throw new Error("Cleaned Ridet is not valid");
    }

    return ridet;
}

export function getPluriannualYears(entity: OsirisRequestEntity): number[] {
    const startYear = parseInt(`${entity.dossier.exerciceDebut}`, 10);
    const endYear = parseInt(`${entity.dossier.exerciceFin}`, 10);
    if (isNaN(startYear) || isNaN(endYear)) return [];

    const years: number[] = [];
    for (let start = startYear; start <= endYear; start++) {
        years.push(start);
    }

    return years;
}

// return all application cofinancers based on all linked actions
// return empty string if no cofinancers is found
export function getCofinancers(actions: OsirisActionEntity[]): string[] {
    const cofinancersNames = Array.from(
        actions.reduce((acc, action) => {
            const cofinancers = action.cofinanceurs?.noms;
            if (!cofinancers) return acc;
            cofinancers.split(";").forEach(cofinancer => acc.add(cofinancer));
            return acc;
        }, new Set<string>()),
    ).filter(str => str); // remove empty set value from the last trailing comma if exists

    return cofinancersNames;
}

export function toOsirisDate(value: unknown): Date | unknown {
    if (!value) return value;
    if (value instanceof Date) return value;
    if (typeof value === "number") return GenericParser.ExcelDateToJSDate(value);

    return DDMMYYYYToUTCDate(`${value}`);
}
