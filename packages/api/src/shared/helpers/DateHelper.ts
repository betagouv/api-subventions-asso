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

export const dateToUTCMonthYear = date => new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));

export const firstDayOfPeriod = (year: number, month = 0) => new Date(Date.UTC(year, month, 1));

export const oneYearAfterPeriod = (year: number, month: number | undefined = undefined) => {
    if (month === undefined) return new Date(Date.UTC(year + 1, 0, 1));
    return new Date(Date.UTC(year, month + 1, 1));
};

export const computeMonthBetweenDates = (dateA: Date, dateB: Date): number => {
    return Math.abs(dateA.getMonth() - dateB.getMonth() + (dateA.getFullYear() - dateB.getFullYear()) * 12);
};

export const sameDateNextYear = (date: Date): Date => new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

export const getShortISODate = (date: Date) => date.toISOString().substring(0, 10);

export const shortISORegExp = new RegExp(/\d{4}-[01]\d-[0-3]\d/);

export const shortISOPeriodRegExp = new RegExp(/\d{4}-[01]\d-[0-3]\d\/\d{4}-[01]\d-[0-3]\d/);

export const addDaysToDate = (date, nbOfDays = 1) => new Date(new Date(date).setDate(date.getDate() + nbOfDays));

export const isShortISODateParam = date => !!date && shortISORegExp.test(date);
