import { stringify } from "csv-stringify/sync";

// BOM (Byte Order Mark, https://en.wikipedia.org/wiki/Byte_order_mark) that forces Excel to use UTF-8
const BOM_UTF8 = "\uFEFF";

export const linesToCsv = array => array.join("\n");

export const arrayToLine = array => array.join(";");

export const downloadCsv = (content, filename) => {
    const blob = new Blob([BOM_UTF8, content], { type: "text/csv;charset=utf8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
};

export const buildCsv = (headers, rows) => {
    if (!Array.isArray(headers) || !Array.isArray(rows)) return undefined;
    return stringify([headers, ...rows], { delimiter: ";" });
};
