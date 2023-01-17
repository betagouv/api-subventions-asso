import { capitalizeFirstLetter } from "./textHelper";

export const sortByDateAsc = (a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date - b.date;
};

export const withTwoDigitYear = date => {
    if (date instanceof Date) {
        const localeDate = date.toLocaleDateString();
        const last2Digit = localeDate.slice(-2);
        const dateWithoutYear = localeDate.slice(0, 6);
        return dateWithoutYear.concat(last2Digit);
    } else return date;
};

export const dateToDDMMYYYY = _date => {
    const date = new Date(_date);
    return `${getDayWithZero(date.getDate())}/${getMonthWithZero(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export const getDayWithZero = day => ("0" + day).slice(-2);

export const getMonthWithZero = day => ("0" + day).slice(-2);

export const isValidDate = date => date instanceof Date && !isNaN(date);

export const getOneYearBeforeDate = date => {
    const prevDate = new Date(date);
    prevDate.setFullYear(date.getFullYear() - 1);
    prevDate.setDate(date.getDate() + 1);
    return prevDate;
};

export const YEAR_START_LOGS = 2021;

export const YEAR_CHOICES = [];
for (let year = YEAR_START_LOGS; year <= new Date().getFullYear(); year++) YEAR_CHOICES.push(year);

export function monthCapitalizedFromId(monthId) {
    const monthStr = new Date(Date.parse(monthId + 1 + " 1, 2022")).toLocaleDateString(`en`, { month: "long" });
    return capitalizeFirstLetter(monthStr);
}
