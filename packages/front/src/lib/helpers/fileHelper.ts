import jschardet from "jschardet";
import XLSX from "xlsx";

export type FileFormat = "csv" | "xls" | "pdf" | "doc" | "image" | "txt" | "json" | "xml" | "zip" | "audio" | "video";

export const formatMap: Record<string, string[]> = {
    csv: [".csv", "text/csv"],
    xls: [
        ".xls",
        ".xlsx",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    pdf: [".pdf", "application/pdf"],
    doc: [
        ".doc",
        ".docx",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", "image/*"],
    txt: [".txt", "text/plain"],
    json: [".json", "application/json"],
    xml: [".xml", "text/xml", "application/xml"],
    zip: [".zip", ".rar", ".7z", "application/zip", "application/x-rar-compressed"],
    audio: [".mp3", ".wav", ".ogg", ".m4a", "audio/*"],
    video: [".mp4", ".avi", ".mov", ".wmv", ".flv", "video/*"],
};

const TEXT_EXT: string[] = ["txt", "csv", "json", "xml"];

export const FileErrorCode = {
    INVALID_FORMAT: "INVALID_FORMAT",
    FILE_TOO_LARGE: "FILE_TOO_LARGE",
    INVALID_ENCODING: "INVALID_ENCODING",
};

type FileErrorCode = (typeof FileErrorCode)[keyof typeof FileErrorCode];

export type FileValidationResult = {
    valid: boolean;
    errorCode?: FileErrorCode;
};

export async function validateFile(
    file: File,
    acceptedFormats: FileFormat[],
    maxSizeMB: number = 30,
): Promise<FileValidationResult> {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    const isFormatValid = acceptedFormats.some(format => {
        const allowedTypes = formatMap[format];

        const extensions = allowedTypes.filter(type => type.startsWith("."));
        const mimeTypes = allowedTypes.filter(type => !type.startsWith("."));

        const hasValidExtension = extensions.includes(fileExtension);

        const hasValidMimeType =
            !file.type ||
            mimeTypes.some(mime => {
                if (mime.endsWith("/*")) {
                    return file.type.startsWith(mime.replace("/*", "/"));
                }
                return file.type === mime;
            });

        return hasValidExtension && hasValidMimeType;
    });

    if (!isFormatValid) {
        return {
            valid: false,
            errorCode: FileErrorCode.INVALID_FORMAT,
        };
    }

    if (!(await verifyTextEncoding(file))) {
        return {
            valid: false,
            errorCode: FileErrorCode.INVALID_ENCODING,
        };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            errorCode: FileErrorCode.FILE_TOO_LARGE,
        };
    }

    return { valid: true };
}

export async function verifyTextEncoding(file: File): Promise<boolean> {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension && TEXT_EXT.includes(fileExtension)) {
        try {
            const text = await file.text();
            const result = jschardet.detect(text);
            const encoding = result?.encoding?.toLowerCase();

            return !!(
                encoding?.includes("utf-8") ||
                encoding?.includes("utf8") ||
                encoding?.includes("windows-1252") ||
                encoding?.includes("win1252")
            );
        } catch (e) {
            throw new Error(`Encoding verification failed for file ${file.name} ` + e);
        }
    }
    return true;
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
