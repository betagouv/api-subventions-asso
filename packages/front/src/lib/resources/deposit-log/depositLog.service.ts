import depositLogPort from "$lib/resources/deposit-log/depositLog.port";
import {
    type CreateDepositScdlLogDto,
    type DepositScdlLogDto,
    type DepositScdlLogResponseDto,
    type FileDownloadUrlDto,
    type UploadedFileInfosDto,
} from "dto";
import { stringify } from "csv-stringify/browser/esm/sync";

export const FILE_VALIDATION_STATES = {
    MULTIPLE_ALLOCATORS: "multipleAllocator",
    LESS_GRANT_DATA: "lessGrantData",
    BLOCKING_ERRORS: "blockingErrors",
    CONFIRM_DATA_ADD: "confirmDataAdd",
} as const;
export type FileValidationState = (typeof FILE_VALIDATION_STATES)[keyof typeof FILE_VALIDATION_STATES];

class DepositLogService {
    async getDepositLog() {
        const response = await depositLogPort.getDepositLog();
        if (response.status === 204) {
            return null;
        } else {
            return response.data as DepositScdlLogResponseDto;
        }
    }

    async createDepositLog(data: CreateDepositScdlLogDto) {
        const response = await depositLogPort.createDepositLog(data);
        return response.data as DepositScdlLogResponseDto;
    }

    async updateDepositLog(step: number, data: DepositScdlLogDto) {
        const response = await depositLogPort.updateDepositLog(step, data);
        return response.data as DepositScdlLogResponseDto;
    }

    async deleteDepositLog() {
        await depositLogPort.deleteDepositLog();
        return null;
    }

    async postScdlFile(file: File, depositLog: DepositScdlLogDto, sheetName?: string) {
        const response = await depositLogPort.validateScdlFile(file, depositLog, sheetName);
        return response.data as DepositScdlLogResponseDto;
    }

    async getCsv() {
        const response = await depositLogPort.getExistingScdlDatas();

        const headers = response.headers;
        const contentDisposition = headers["content-disposition"];

        const fileName = contentDisposition.split("filename=")[1];

        return {
            csvData: response.data,
            fileName: fileName,
        };
    }

    async persistScdlFile() {
        await depositLogPort.persistScdlFile();
    }

    async generateScdlFileUrl() {
        const response = await depositLogPort.getFileDownloadUrl();
        return response.data as FileDownloadUrlDto;
    }

    determineFileValidationState(declaredSiret: string, fileInfos: UploadedFileInfosDto): FileValidationState {
        const hasMultipleAllocators =
            fileInfos.allocatorsSiret.length > 1 ||
            (fileInfos.allocatorsSiret.length === 1 && declaredSiret !== fileInfos.allocatorsSiret[0]);
        const hasLessGrantData = fileInfos.parseableLines < fileInfos.existingLinesInDbOnSamePeriod;
        const hasBlockingErrors = fileInfos.errors.some(error => error.bloquant === "oui") ?? false;

        if (hasMultipleAllocators) return FILE_VALIDATION_STATES.MULTIPLE_ALLOCATORS;
        if (hasLessGrantData) return FILE_VALIDATION_STATES.LESS_GRANT_DATA;
        if (hasBlockingErrors) return FILE_VALIDATION_STATES.BLOCKING_ERRORS;
        return FILE_VALIDATION_STATES.CONFIRM_DATA_ADD;
    }

    async downloadErrorFile(fileInfos: UploadedFileInfosDto) {
        const csvErrors = stringify(fileInfos.errors, {
            header: true,
            quoted: true,
            quoted_empty: true,
        });

        const blob = new Blob([csvErrors], { type: "text/csv; charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileInfos.fileName}.csv-errors.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    async downloadScdlFile(filename: string) {
        const data = await this.generateScdlFileUrl();
        const link = document.createElement("a");
        link.href = data.url;
        link.download = filename;
        link.click();
    }

    async downloadGrantsCsv() {
        const { csvData, fileName } = await this.getCsv();
        const blob = new Blob([csvData], { type: "text/csv; charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}

const depositLogService = new DepositLogService();

export default depositLogService;
