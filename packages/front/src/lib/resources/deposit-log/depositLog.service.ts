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
}

const depositLogService = new DepositLogService();

export default depositLogService;
