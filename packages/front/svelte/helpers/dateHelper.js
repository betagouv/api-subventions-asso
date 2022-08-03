export const sortByDateAsc = (a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date - b.date;
};

export const withTwoDigitYear = (date) => {
    if (typeof date !== "string") return date;
    const last2Digit = date.slice(-2);
    const dateWithoutYear = date.slice(0, 6);
    return dateWithoutYear.concat(last2Digit);
}
