import jschardet from "jschardet";
import XLSX from "xlsx";
import FileFormatError from "$lib/errors/file-errors/FileFormatError";
import FileSizeError from "$lib/errors/file-errors/FileSizeError";
import FileEncodingError from "$lib/errors/file-errors/FileEncodingError";

export type FileFormat = "csv" | "xls";

export const formatMap: Record<FileFormat, string[]> = {
    csv: [".csv", "text/csv"],
    xls: [
        ".xls",
        ".xlsx",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
};

export const TEXT_EXT: string[] = ["txt", "csv", "json", "xml"];
export const EXCEL_EXT: string[] = ["xls", "xlsx"];

export function getFileExtension(fileName: string): string {
    const parts = fileName.split(".");
    if (parts.length < 2) throw new FileFormatError(fileName);
    const ext = parts.pop();
    if (!ext || ext === "") throw new FileFormatError(fileName);

    return ext.toLowerCase();
}

export async function validateFile(file: File, acceptedFormats: FileFormat[], maxSizeMB: number = 30): Promise<void> {
    const fileExtension = getFileExtension(file.name);

    validateFileSize(file, maxSizeMB);
    validateFileFormat(file, fileExtension, acceptedFormats);

    if (TEXT_EXT.includes(fileExtension)) {
        await validateFileEncoding(file);
    }
}

export function validateFileSize(file: File, maxSizeMB: number): void {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        throw new FileSizeError(file.name, maxSizeMB);
    }
}

export function validateFileFormat(file: File, fileExtension: string, acceptedFormats: FileFormat[]): void {
    const isFormatValid = acceptedFormats.some(format => {
        return isValidFormatForFile(file, format, fileExtension);
    });

    if (!isFormatValid) {
        throw new FileFormatError(file.name);
    }
}

export async function validateFileEncoding(file: File): Promise<void> {
    const text = await file.text();
    const result = jschardet.detect(text);
    const encoding = result?.encoding?.toLowerCase();

    const isValidEncoding = ["utf-8", "utf8", "windows-1252", "win1252"].includes(encoding);

    if (!isValidEncoding) {
        throw new FileEncodingError(file.name, ["UTF-8", "Windows-1252"]);
    }
}

function isValidFormatForFile(file: File, format: FileFormat, fileExtension: string | undefined): boolean {
    if (!fileExtension) return false;
    const allowedTypes = formatMap[format];
    const extensions = allowedTypes.filter(type => type.startsWith("."));
    const mimeTypes = allowedTypes.filter(type => !type.startsWith("."));

    const hasValidExtension = extensions.includes("." + fileExtension);
    const hasValidMimeType = isValidMimeType(file.type, mimeTypes);

    return hasValidExtension && hasValidMimeType;
}

function isValidMimeType(fileType: string, allowedMimeTypes: string[]): boolean {
    if (!fileType) return true;

    return allowedMimeTypes.some(mime => {
        if (mime.endsWith("/*")) {
            return fileType.startsWith(mime.replace("/*", "/"));
        }
        return fileType === mime;
    });
}

export async function getExcelSheetNames(file: File): Promise<string[]> {
    try {
        const arrayBuffer = await file.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, {
            type: "array",
            bookSheets: true,
        });

        return workbook.SheetNames;
    } catch (e) {
        throw new Error(`Error reading Excel file ${file.name} ` + e);
    }
}
