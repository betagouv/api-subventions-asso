import depositLogPort from "$lib/resources/deposit-log/depositLog.port";
import type { CreateDepositScdlLogDto, DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";

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

    async persistScdlFile(file: File) {
        await depositLogPort.persistScdlFile(file);
    }
}

const depositLogService = new DepositLogService();

export default depositLogService;
