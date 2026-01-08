import { CreateDepositScdlLogDto, DepositScdlLogDto } from "dto";
import depositScdlProcessCheckService from "./DepositScdlProcess.check.service";
import { BadRequestError } from "core";
import {
    DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_ENTITY_STEP_2,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
} from "../__fixtures__/depositLog.fixture";
import scdlService from "../../providers/scdl/scdl.service";
import MiscScdlGrantEntity from "../../providers/scdl/entities/MiscScdlGrantEntity";
import DepositScdlLogEntity from "../entities/depositScdlLog.entity";
import UploadedFileInfosEntity from "../entities/uploadedFileInfos.entity";
import { MixedParsedError } from "../../providers/scdl/@types/Validation";

describe("DepositScdlProcess check service", () => {
    describe("validateCreate", () => {
        it("should accept valid data", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: true, allocatorSiret: "12345678901234" };

            expect(() => depositScdlProcessCheckService.validateCreate(dto)).not.toThrow();
        });

        it("should throw BadRequestError if overwriteAlert is false", () => {
            const dto: CreateDepositScdlLogDto = { overwriteAlert: false };

            expect(() => depositScdlProcessCheckService.validateCreate(dto)).toThrow(BadRequestError);
            expect(() => depositScdlProcessCheckService.validateCreate(dto)).toThrow(
                "overwrite alert must be accepted",
            );
        });
    });

    describe("validateUpdateConsistency", () => {
        it("should accept valid data", () => {
            expect(() => depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_DTO, 2)).not.toThrow();
        });

        it("should throw BadRequestError if invalid step", () => {
            expect(() =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 8),
            ).toThrow(BadRequestError);
        });

        it("should throw BadRequestError if inconsistency properties in step", () => {
            expect(() =>
                depositScdlProcessCheckService.validateUpdateConsistency(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2, 1),
            ).toThrow(BadRequestError);
        });

        it("should throw BadRequestError if not a siret", () => {
            const wrongSiret: DepositScdlLogDto = { allocatorSiret: "123456789" };
            expect(() => depositScdlProcessCheckService.validateUpdateConsistency(wrongSiret, 1)).toThrow(
                BadRequestError,
            );
        });

        it("should throw BadRequestError if overwriteAlert not accepted", () => {
            const alertNotAccepted: DepositScdlLogDto = { overwriteAlert: false };
            expect(() => depositScdlProcessCheckService.validateUpdateConsistency(alertNotAccepted, 1)).toThrow(
                BadRequestError,
            );
        });
    });

    describe("finalCheckBeforePersist", () => {
        const mockGetGrantsOnPeriodByAllocator = jest.spyOn(
            scdlService,
            "getGrantsOnPeriodByAllocator",
        ) as jest.SpyInstance<Promise<MiscScdlGrantEntity[]>, [string, number[]]>;

        beforeEach(() => {
            mockGetGrantsOnPeriodByAllocator.mockReset();
        });

        it("should accept valid data", async () => {
            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(
                depositScdlProcessCheckService.finalCheckBeforePersist(DEPOSIT_LOG_ENTITY_STEP_2),
            ).resolves.not.toThrow();
        });

        it("should throw when no uploadedFileInfos", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "uploadedFileInfos must be defined",
            );
        });

        it("should throw when wrong step", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 1,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                uploadedFileInfos: {} as UploadedFileInfosEntity,
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "deposit must be in step 2",
            );
        });

        it("should throw when overwriteAlert false", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: false,
                uploadedFileInfos: {} as UploadedFileInfosEntity,
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "overwrite alert must be acknowledged",
            );
        });

        it("should throw when allocator siret undefined", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: undefined,
                overwriteAlert: true,
                uploadedFileInfos: {} as UploadedFileInfosEntity,
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "allocator SIRET must be defined",
            );
        });

        it("should throw when permission alert false", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: false,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                uploadedFileInfos: {} as UploadedFileInfosEntity,
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "permission alert must be acknowledged",
            );
        });

        it("should throw when multiple allocator siret", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                uploadedFileInfos: {
                    fileName: "test.csv",
                    uploadDate: new Date("2025-11-03T00:00:00.000Z"),
                    allocatorsSiret: ["12345678901234", "12345678901236"],
                    grantCoverageYears: [2021, 2022],
                    parseableLines: 200,
                    totalLines: 202,
                    existingLinesInDbOnSamePeriod: 0,
                    errorStats: { count: 0, errors: [] },
                },
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "allocator SIRET in file does not match deposit allocator SIRET",
            );
        });

        it("should throw when mismatch allocator siret", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901236",
                overwriteAlert: true,
                uploadedFileInfos: {
                    fileName: "test.csv",
                    uploadDate: new Date("2025-11-03T00:00:00.000Z"),
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2021, 2022],
                    parseableLines: 200,
                    totalLines: 202,
                    existingLinesInDbOnSamePeriod: 0,
                    errorStats: { count: 0, errors: [] },
                },
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "allocator SIRET in file does not match deposit allocator SIRET",
            );
        });

        it("should throw when blocking errors", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                uploadedFileInfos: {
                    fileName: "test.csv",
                    uploadDate: new Date("2025-11-03T00:00:00.000Z"),
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2021, 2022],
                    parseableLines: 200,
                    totalLines: 202,
                    existingLinesInDbOnSamePeriod: 0,
                    errorStats: {
                        count: 1,
                        errors: [
                            {
                                bloquant: "oui",
                            } as MixedParsedError,
                        ],
                    },
                },
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce([]);
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "file contains blocking errors that must be resolved",
            );
        });

        it("should throw when less rows than in db", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                uploadedFileInfos: {
                    fileName: "test.csv",
                    uploadDate: new Date("2025-11-03T00:00:00.000Z"),
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2021, 2022],
                    parseableLines: 200,
                    totalLines: 201,
                    existingLinesInDbOnSamePeriod: 300,
                    errorStats: { count: 0, errors: [] },
                },
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce(
                Array.from({ length: 300 }, () => ({}) as MiscScdlGrantEntity),
            );
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "The file contains less rows of data than what we have in the database.",
            );
        });

        it("should throw when existing lines in db mismatch the actual", async () => {
            const depositLog: DepositScdlLogEntity = {
                userId: "68d6ab9b48ce4a950f7e96df",
                step: 2,
                updateDate: new Date("2025-09-26T00:00:00.000Z"),
                permissionAlert: true,
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                uploadedFileInfos: {
                    fileName: "test.csv",
                    uploadDate: new Date("2025-11-03T00:00:00.000Z"),
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2021, 2022],
                    parseableLines: 200,
                    totalLines: 201,
                    existingLinesInDbOnSamePeriod: 180,
                    errorStats: { count: 0, errors: [] },
                },
            };

            mockGetGrantsOnPeriodByAllocator.mockResolvedValueOnce(
                Array.from({ length: 190 }, () => ({}) as MiscScdlGrantEntity),
            );
            await expect(depositScdlProcessCheckService.finalCheckBeforePersist(depositLog)).rejects.toThrow(
                "The number of lines in the database does not match with the one detected during the previous parse",
            );
        });
    });
});
