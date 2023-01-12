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

export const MMDDYYYDate = date => {
    // can be date or string
    const localDate = new Date(date);
    return localDate.toLocaleString().split(",")[0];
};

export const isValidDate = date => date instanceof Date && !isNaN(date);
