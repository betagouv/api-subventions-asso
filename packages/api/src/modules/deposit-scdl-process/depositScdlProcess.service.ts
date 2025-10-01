import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import DepositScdlLogEntity from "./depositScdlLog.entity";
import { CreateDepositScdlLogDto } from "dto";
import DepositLogAdapter from "../../dataProviders/db/deposit-log/DepositLog.adapter";
import { ConflictError } from "core";
import depositScdlProcessCheckService from "./check/DepositScdlProcess.check.service";

export class DepositScdlProcessService {
    FIRST_STEP = 1;

    public async getDepositLog(userId: string): Promise<DepositScdlLogEntity | null> {
        return await depositLogPort.findOneByUserId(userId);
    }

    public async deleteDepositLog(userId: string): Promise<void> {
        await depositLogPort.deleteByUserId(userId);
        return;
    }

    async createDepositLog(
        createDepositScdlLogDto: CreateDepositScdlLogDto,
        userId: string,
    ): Promise<DepositScdlLogEntity> {
        const existingDepositLog = await this.getDepositLog(userId);
        if (existingDepositLog) {
            throw new ConflictError("Deposit log already exists");
        }
        depositScdlProcessCheckService.validateCreate(createDepositScdlLogDto);
        const depositLogEntity = DepositLogAdapter.createDepositScdlLogDtoToEntity(
            createDepositScdlLogDto,
            userId,
            this.FIRST_STEP,
        );
        await depositLogPort.insertOne(depositLogEntity);
        return depositLogEntity;
    }
}

const depositScdlProcessService = new DepositScdlProcessService();

export default depositScdlProcessService;
