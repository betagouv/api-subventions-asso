import jschardet from "jschardet";
import * as XLSX from "xlsx";
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

const UTF8 = "utf-8";
const WINDOWS_1252 = "windows-1252";
const supportedEncodings = [UTF8, WINDOWS_1252];

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
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    if (isValidUTF8(buffer)) {
        return;
    }

    const text = new TextDecoder("latin1").decode(buffer);
    const detection = jschardet.detect(text);
    const enc = detection?.encoding?.toLowerCase();

    const normalized = normalizeEncoding(enc);

    if (!normalized || !supportedEncodings.includes(normalized)) {
        throw new FileEncodingError(file.name, supportedEncodings);
    }
}

function normalizeEncoding(enc: string | undefined): string | null {
    const encodingMap: Record<string, string> = {
        "utf-8": UTF8,
        utf8: UTF8,
        "windows-1252": WINDOWS_1252,
        win1252: WINDOWS_1252,
    };

    return enc ? encodingMap[enc] || null : null;
}

function isValidUTF8(bytes: Uint8Array): boolean {
    try {
        new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        return true;
    } catch {
        return false;
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
