// BOM (Byte Order Mark, https://en.wikipedia.org/wiki/Byte_order_mark) that forces Excel to use UTF-8
const BOM_UTF8 = "\uFEFF";

export const linesToCsv = array => array.join("\n");

export const arrayToLine = array => array.join(";");

export const downloadCsv = (content, filename) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + BOM_UTF8 + content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const buildCsv = (headers, rows) => {
    if (!Array.isArray(headers) || !Array.isArray(rows)) return undefined;
    return linesToCsv([arrayToLine(headers), ...rows.map(arrayToLine)]);
};
