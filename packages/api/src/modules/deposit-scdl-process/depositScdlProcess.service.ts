import depositLogPort from "../../dataProviders/db/deposit-log/depositLog.port";
import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import { ConflictError, NotFoundError } from "core";
import depositScdlProcessCheckService from "./check/DepositScdlProcess.check.service";
import DepositScdlLogDtoAdapter from "./depositScdlLog.dto.adapter";
import scdlService from "../providers/scdl/scdl.service";
import { detectCsvDelimiter } from "../../shared/helpers/FileHelper";
import UploadedFileInfosEntity from "./entities/uploadedFileInfos.entity";
import { DefaultObject } from "../../@types";

export class DepositScdlProcessService {
    FIRST_STEP = 1;
    SECOND_STEP = 2;

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
        const depositLogEntity = DepositScdlLogDtoAdapter.createDepositScdlLogDtoToEntity(
            createDepositScdlLogDto,
            userId,
            this.FIRST_STEP,
        );
        await depositLogPort.insertOne(depositLogEntity);
        return depositLogEntity;
    }

    async updateDepositLog(
        step: number,
        depositScdlLogDto: DepositScdlLogDto,
        userId: string,
    ): Promise<DepositScdlLogEntity> {
        await this.findAndValidateDepositLog(userId, depositScdlLogDto, step);
        const partialDepositLog: Partial<DepositScdlLogEntity> = {
            step,
            userId,
            ...depositScdlLogDto,
        };
        return depositLogPort.updatePartial(partialDepositLog);
    }

    private async findAndValidateDepositLog(
        userId: string,
        depositScdlLogDto: DepositScdlLogDto,
        step: number,
    ): Promise<DepositScdlLogEntity> {
        const existingDepositLog = await this.getDepositLog(userId);
        if (!existingDepositLog) {
            throw new NotFoundError("No deposit log found for this user");
        }
        depositScdlProcessCheckService.validateUpdateConsistency(depositScdlLogDto, step);
        return existingDepositLog;
    }

    async validateScdlFile(
        file: Express.Multer.File,
        depositScdlLogDto: DepositScdlLogDto,
        type: "csv" | "excel",
        userId: string,
        pageName?: string | undefined,
    ): Promise<DepositScdlLogEntity> {
        const existingDepositLog = await this.findAndValidateDepositLog(userId, depositScdlLogDto, this.SECOND_STEP);

        const parsedResult = this.parseFile(file, type, pageName);

        existingDepositLog.uploadedFileInfos = new UploadedFileInfosEntity(
            file.filename,
            new Date(),
            parsedResult.allocatorSirets,
            parsedResult.errors,
            undefined, // todo: add beginPaymentDate, endPaymentDate, parseableLines, existingLinesInDbOnSamePeriod
            undefined,
            undefined,
            undefined,
        );
        existingDepositLog.overwriteAlert = depositScdlLogDto.overwriteAlert;
        existingDepositLog.step = this.SECOND_STEP;

        return depositLogPort.updatePartial(existingDepositLog);
    }

    private parseFile(file: Express.Multer.File, type: "csv" | "excel", pageName: string | undefined) {
        const fileContent = file.buffer;
        if (type === "csv") {
            const delimiter = detectCsvDelimiter(fileContent);
            return scdlService.parseCsv(fileContent, delimiter);
        } else {
            return scdlService.parseXls(fileContent, pageName);
        }
    }

    find(query: DefaultObject = {}): Promise<DepositScdlLogEntity[]> {
        return depositLogPort.find(query);
    }
}

const depositScdlProcessService = new DepositScdlProcessService();

export default depositScdlProcessService;
