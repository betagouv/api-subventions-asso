import { getValue } from "./providerValueHelper";

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

export const YEAR_START_LOGS = 2022;

export const STATS_YEAR_CHOICES = [];
for (let year = YEAR_START_LOGS; year <= new Date().getFullYear(); year++) STATS_YEAR_CHOICES.push(year);

export function monthCapitalizedFromId(monthId) {
    return new Date(2022, monthId, 1).toLocaleDateString(`en`, { month: "long" });
}

export function formatDate(value) {
    const date = new Date(value);

    const doubleNumber = num => ("0" + num).slice(-2);

    return `${doubleNumber(date.getDate())}/${doubleNumber(date.getMonth() + 1)}/${date.getFullYear()}`.replace(
        "  ",
        " ",
    );
}

export function formatDateWithHour(value) {
    const date = new Date(value);

    const doubleNumber = num => ("0" + num).slice(-2);

    return `${formatDate(date.toString())} à ${doubleNumber(date.getHours())}:${doubleNumber(date.getMinutes())}h`;
}

export function toProviderValueString(data) {
    const value = getValue(data);
    if (!value) return;

    return formatDate(value);
}
