/**
 *
 * @param date Date to format
 * @returns string that represents a french date DD/MM/YY
 */
export const withTwoDigitYear = date => {
    if (date instanceof Date) {
        return date.toLocaleDateString("fr-FR", { day: "numeric", month: "numeric", year: "2-digit" });
    } else return date;
};

export const dateToDDMMYYYY = _date => {
    const date = new Date(_date);
    return `${getDayWithZero(date.getDate())}/${getMonthWithZero(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export const getDayWithZero = day => ("0" + day).slice(-2);

export const getMonthWithZero = day => ("0" + day).slice(-2);

export const YEAR_START_LOGS = 2022;

export const STATS_YEAR_CHOICES = [];
for (let year = YEAR_START_LOGS; year <= new Date().getFullYear(); year++) STATS_YEAR_CHOICES.push(year);

export function formatDate(value) {
    const date = new Date(value);

    const doubleNumber = num => ("0" + num).slice(-2);

    return `${doubleNumber(date.getDate())}/${doubleNumber(date.getMonth() + 1)}/${date.getFullYear()}`.replace(
        "  ",
        " ",
    );
}
