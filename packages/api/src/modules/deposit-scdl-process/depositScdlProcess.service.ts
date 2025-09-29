import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import DepositScdlLogEntity from "./depositScdlLog.entity";

export class DepositScdlProcessService {
    public async getDepositState(userId: string): Promise<DepositScdlLogEntity | null> {
        return await depositLogPort.findOneByUserId(userId);
    }

    public async deleteDepositState(userId: string): Promise<void> {
        await depositLogPort.deleteByUserId(userId);
        return;
    }
}

const depositScdlProcessService = new DepositScdlProcessService();

export default depositScdlProcessService;
