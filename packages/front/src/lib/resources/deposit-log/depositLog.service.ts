import depositLogPort from "$lib/resources/deposit-log/depositLog.port";
import type { CreateDepositScdlLogDto, DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import { fileTypeEnum } from "$lib/helpers/fileHelper";

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

    async postScdlFile(file: File, fileType: fileTypeEnum, sheetName?: string): Promise<object> {
        // todo : unimplemented
        console.log("postScdlFile", file, fileType, sheetName);
        return await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

const depositLogService = new DepositLogService();

export default depositLogService;
