import { shortISORegExp } from "./helpers/DateHelper";

export function isAssociationName(name: string): boolean {
    return typeof name === "string" && name.length != 0;
}

// Osiris && LeCompteAsso Part

export function isCompteAssoId(compteAssoId: string): boolean {
    return typeof compteAssoId === "string" && compteAssoId.length === 9 && /\d{2}-\d{6}/.test(compteAssoId);
}

export function isOsirisRequestId(requestId: string): boolean {
    return typeof requestId === "string" && /[A-Z\d-]{4,16}/.test(requestId); // TODO: check if this rules is already true
}

export function isOsirisActionId(actionId: string): boolean {
    return typeof actionId === "string" && /[A-Z\d-]{4,16}/.test(actionId); // TODO: check if this rules is already true
}

// Chorus && Osiris
export function isEJ(ej: string) {
    return typeof ej === "string" && ej.length == 10;
}

// Generique

export function areDates(dates: unknown[]) {
    return dates.every(date => date instanceof Date);
}

export function areStringsValid(strings: unknown[]) {
    return strings.every(s => isStringValid(s));
}

export function isStringValid(str, options?: { acceptEmpty: boolean }) {
    if (options && options.acceptEmpty) return typeof str === "string";
    return !!str && typeof str === "string" && str.length != 0;
}

export function isBooleanValid(bool) {
    if (typeof bool === "boolean") return true;
    if (typeof bool === "string" && ["false", "true"].includes(bool)) return true;
    return false;
}

export function isShortISODateValid(date) {
    return !!date && shortISORegExp.test(date);
}

export function areNumbersValid(numbers: unknown[]) {
    return numbers.every(isNumberValid);
}

export function isNumberValid(number: unknown): number is number {
    return typeof number === "number" && !isNaN(number);
}

export function isCP(cp: string) {
    return typeof cp === "string" && /[0-9]{5}/.test(cp);
}

export function isInObjectValues(obj, value) {
    return Object.values(obj).includes(value);
}
