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
import { Stringifier, stringify } from "csv-stringify";
import MiscScdlAdapter from "../providers/scdl/adapters/MiscScdl.adapter";
import { formatDateToYYYYMMDD } from "../../shared/helpers/DateHelper";
import Siret from "../../identifierObjects/Siret";
import MiscScdlProducerEntity from "../providers/scdl/entities/MiscScdlProducerEntity";

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
        let existingLinesInDbOnSamePeriod: number = 0;
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
            pageName,
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

    async generateExistingGrantsCsv(userId: string): Promise<{ csv: string; fileName: string }> {
        const existingDepositLog = await this.getDepositLog(userId);
        if (!existingDepositLog) {
            throw new NotFoundError("No deposit log found for this user");
        }

        const allocatorsSiret = existingDepositLog.uploadedFileInfos?.allocatorsSiret;
        const exercices = existingDepositLog.uploadedFileInfos?.grantCoverageYears;

        if (!allocatorsSiret || allocatorsSiret.length !== 1 || !exercices) {
            throw new NotFoundError("cannot get existing grants");
        }

        const grants = await scdlService.getGrantsOnPeriodByAllocator(allocatorsSiret[0], exercices);

        const stringifier = stringify({
            header: true,
            quoted: true,
            quoted_empty: true,
        });

        grants.forEach(entity => {
            // todo : generate db data as public scdl schema
            const dto = MiscScdlAdapter.miscScdlGrantEntityToDto(entity);
            stringifier.write(dto);
        });
        stringifier.end();

        const csv = await this.streamToString(stringifier);
        const fileName = this.getFilename(allocatorsSiret[0], exercices);
        return { csv, fileName };
    }

    private getFilename(allocatorSiret: string, exercices: number[]): string {
        const exercicesString = exercices.sort((a, b) => a - b).join("-");

        const formattedDate = formatDateToYYYYMMDD(new Date());

        return `existing-grants-${allocatorSiret}-${exercicesString}-${formattedDate}.csv`;
    }

    private async streamToString(stream: Stringifier): Promise<string> {
        const chunks: string[] = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return chunks.join("");
    }

    async parseAndPersistScdlFile(file: Express.Multer.File, userId: string) {
        // todo : unit test
        const existingDepositLog = await this.getDepositLog(userId);
        if (!existingDepositLog) {
            throw new NotFoundError("No deposit log found for this user");
        }

        await depositScdlProcessCheckService.finalCheckBeforePersist(existingDepositLog, file.originalname);

        const siret = new Siret(existingDepositLog.allocatorSiret!);
        let producer: MiscScdlProducerEntity | null = await scdlService.getProducer(siret);

        if (!producer) {
            producer = await scdlService.createProducer(siret);
        }

        const { entities } = this.parseFile(file, existingDepositLog.uploadedFileInfos?.sheetName);
        await scdlService.persist(producer, entities);

        // todo : data-log
        // await dataLogService.addLog(userId, file.originalname)

        // todo : don't delete deposit log to keep it for auditing but set a boolean to exclude it
        return depositLogPort.deleteByUserId(userId);
    }
}

const depositScdlProcessService = new DepositScdlProcessService();

export default depositScdlProcessService;
