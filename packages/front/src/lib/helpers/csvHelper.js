import { stringify } from "csv-stringify/browser/esm/sync";
import documentHelper from "$lib/helpers/document.helper";

// BOM (Byte Order Mark, https://en.wikipedia.org/wiki/Byte_order_mark) that forces Excel to use UTF-8
const BOM_UTF8 = "\uFEFF";

export const downloadCsv = (content, filename) => {
    const blob = new Blob([BOM_UTF8, content], { type: "text/csv;charset=utf8" });
    documentHelper.download(blob, `${filename}.csv`);
};

export const buildCsv = (headers, rows) => {
    if (!Array.isArray(headers) || !Array.isArray(rows)) return undefined;
    return stringify([headers, ...rows], { delimiter: ";" });
};
