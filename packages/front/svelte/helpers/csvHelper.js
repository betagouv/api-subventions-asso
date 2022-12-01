export const csvToString = array => array.join("\n");

export const arrayToCsv = array => array.join(";");

export const downloadCsv = (content, filename) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const buildCsv = (headers, rows) => {
    if (!Array.isArray(headers) || !Array.isArray(rows)) return undefined;
    return csvToString([arrayToCsv(headers), ...rows.map(arrayToCsv)]);
};
