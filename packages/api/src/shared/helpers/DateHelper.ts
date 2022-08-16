export const isDateNewer = (a: string | Date, b: string | Date) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (!dateA || !dateB) return false;
    const diff = dateA.getTime() - dateB.getTime();
    if (diff >= 0) return true;
    else return false;
};