import { BadRequestError } from "core";

export type SearchLocation = { departmentCode: string } | { postalCode: string };

const DEPARTMENT_CODE_REGEX = /^(?:\d{2,3}|2[AB])$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;

export function parseSearchLocation(location?: string): SearchLocation | undefined {
    if (location === undefined) return undefined;

    const normalizedLocation = location.trim().toUpperCase();
    if (DEPARTMENT_CODE_REGEX.test(normalizedLocation)) return { departmentCode: normalizedLocation };
    if (POSTAL_CODE_REGEX.test(normalizedLocation)) return { postalCode: normalizedLocation };

    throw new BadRequestError("location must be a department code or a five-digit postal code");
}
