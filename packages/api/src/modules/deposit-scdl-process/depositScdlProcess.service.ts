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
import MiscScdlGrantEntity from "../providers/scdl/entities/MiscScdlGrantEntity";

export class DepositScdlProcessService {
    FIRST_STEP = 1;
    SECOND_STEP = 2;
    CSV_EXT = ".csv";

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
        const existingDepositLog = await this.getDepositLog(userId);
        if (!existingDepositLog) {
            throw new NotFoundError("No deposit log found for this user");
        }
        depositScdlProcessCheckService.validateUpdateConsistency(depositScdlLogDto, step);

        const partialDepositLog: Partial<DepositScdlLogEntity> = {
            step,
            userId,
            ...depositScdlLogDto,
        };
        return depositLogPort.updatePartial(partialDepositLog);
    }

    async validateScdlFile(
        file: Express.Multer.File,
        depositScdlLogDto: DepositScdlLogDto,
        userId: string,
        pageName?: string | undefined,
    ): Promise<DepositScdlLogEntity> {
        const existingDepositLog = await this.getDepositLog(userId);
        if (!existingDepositLog) {
            throw new NotFoundError("No deposit log found for this user");
        }
        depositScdlLogDto.overwriteAlert = existingDepositLog.overwriteAlert;
        depositScdlLogDto.allocatorSiret = existingDepositLog.allocatorSiret;

        depositScdlProcessCheckService.validateUpdateConsistency(depositScdlLogDto, this.SECOND_STEP);

        const { parsedInfos, errors } = this.parseFile(file, pageName);

        const hasSameAllocatorSiret =
            !!existingDepositLog.allocatorSiret &&
            parsedInfos.allocatorsSiret.length === 1 &&
            parsedInfos.allocatorsSiret[0] === existingDepositLog.allocatorSiret;
        let existingLinesInDbOnSamePeriod: number | undefined;
        if (hasSameAllocatorSiret) {
            const documentsInDB: MiscScdlGrantEntity[] = await scdlService.getGrantsOnPeriodByAllocator(
                parsedInfos.allocatorsSiret[0],
                parsedInfos.grantCoverageYears,
            );
            existingLinesInDbOnSamePeriod = documentsInDB.length;
        }

        const uploadedFileInfos = new UploadedFileInfosEntity(
            file.originalname,
            new Date(),
            parsedInfos.allocatorsSiret,
            parsedInfos.grantCoverageYears,
            parsedInfos.parseableLines,
            parsedInfos.totalLines,
            existingLinesInDbOnSamePeriod,
            errors,
        );

        return depositLogPort.updatePartial(
            new DepositScdlLogEntity(
                userId,
                this.SECOND_STEP,
                undefined,
                undefined,
                undefined,
                depositScdlLogDto.permissionAlert,
                uploadedFileInfos,
            ),
        );
    }

    private parseFile(file: Express.Multer.File, pageName: string | undefined) {
        const fileContent = file.buffer;
        const isCsv = file.originalname.toLowerCase().endsWith(this.CSV_EXT);

        if (isCsv) {
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
