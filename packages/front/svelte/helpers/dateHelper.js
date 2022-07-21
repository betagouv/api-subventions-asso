export const sortByDateAsc = (a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date - b.date;
};

export const breakDateYear = date => {
    const dateArray = date.split("/");
    const [day, month, year] = dateArray;
    return `${day}/${month}<br>/${year}`;
};
