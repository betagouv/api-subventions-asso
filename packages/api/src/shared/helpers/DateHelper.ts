import { capitalizeFirstLetter } from "./StringHelper";

export const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const isDateNewer = (a: string | Date, b: string | Date) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (!dateA || !dateB) return false;
    const diff = dateA.getTime() - dateB.getTime();
    if (diff >= 0) return true;
    else return false;
};

export const sortDatesAsc = (a: string | Date, b: string | Date) => {
    return new Date(a).getTime() - new Date(b).getTime();
};

export const getMostRecentDate = (dates: Date[]) => {
    return dates.sort(sortDatesAsc).at(-1);
};

export const getMostOldestDate = (dates: Date[]) => {
    return dates.sort(sortDatesAsc)[0];
};

export const frenchToEnglishMonthsMap = {
    JANVIER: "january",
    FEVRIER: "february",
    MARS: "march",
    AVRIL: "april",
    MAI: "may",
    JUIN: "june",
    JUILLET: "july",
    AOUT: "august",
    SEPTEMBRE: "september",
    OCTOBRE: "october",
    NOVEMBRE: "november",
    DECEMBRE: "december",
};

export const englishMonthNames = Object.values(frenchToEnglishMonthsMap).map(monthLowercase =>
    capitalizeFirstLetter(monthLowercase),
);

export const getMonthFromFrenchStr = (month: string) => {
    return frenchToEnglishMonthsMap[month];
};

export const isValidDate = date => date instanceof Date && !isNaN(date as unknown as number);

export const dateToUTCMonthYear = date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

export const firstDayOfPeriod = (year: number, month = 0) => new Date(Date.UTC(year, month, 1));

export const oneYearAfterPeriod = (year: number, month: number | undefined = undefined) => {
    if (month === undefined) return new Date(Date.UTC(year + 1, 0, 1));
    return new Date(Date.UTC(year, month + 1, 1));
};

export const computeMonthBetweenDates = (dateA: Date, dateB: Date): number => {
    return Math.abs(dateA.getUTCMonth() - dateB.getUTCMonth() + (dateA.getUTCFullYear() - dateB.getUTCFullYear()) * 12);
};

export const sameDateNextYear = date => modifyDateYear(date, 1);

export const modifyDateYear = (date: Date, diff: number): Date => {
    const modifiedDateYear = new Date(date);
    modifiedDateYear.setUTCFullYear(date.getUTCFullYear() + diff);
    return modifiedDateYear;
};

export const getShortISODate = (date: Date) => date.toISOString().substring(0, 10);

export const shortISORegExp = new RegExp(/\d{4}-[01]\d-[0-3]\d/);

export const shortISOPeriodRegExp = new RegExp(/\d{4}-[01]\d-[0-3]\d\/\d{4}-[01]\d-[0-3]\d/);

export const addDaysToDate = (date: Date, nbOfDays = 1) =>
    new Date(new Date(date).setUTCDate(date.getUTCDate() + nbOfDays));

export function formatDateToYYYYMMDD(date: Date): string {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
}

export function formatDateToYYYYMMDDWithDash(date: Date): string {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export function formatIsoDateRangeWithSlash(startDate?: Date, endDate?: Date): string | undefined {
    const start = startDate ? formatDateToYYYYMMDDWithDash(startDate) : null;
    const end = endDate ? formatDateToYYYYMMDDWithDash(endDate) : null;

    if (start && end) {
        return `${start}/${end}`;
    }
    return start || end || undefined;
}
