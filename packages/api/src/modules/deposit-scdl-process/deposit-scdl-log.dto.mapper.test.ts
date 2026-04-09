import {
    DEPOSIT_LOG_ENTITY,
    DEPOSIT_LOG_ENTITY_STEP_2,
    UPLOADED_FILE_INFOS_ENTITY,
} from "./__fixtures__/deposit-log.fixture";
import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import DepositScdlLogDtoMapper from "./deposit-scdl-log.dto.mapper";
import { CreateDepositScdlLogDto, DepositScdlLogDto, MixedParsedErrorDto, UploadedFileInfosDto } from "dto";

describe("depositScdlLogDtoAdapter", () => {
    describe("entityToDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoMapper.entityToDepositScdlLogDto(entity);

            expect(result).toEqual({
                allocatorSiret: entity.allocatorSiret,
                allocatorName: entity.allocatorName,
                permissionAlert: entity.permissionAlert,
            });
        });
    });

    describe("entityToCreateDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to CreateDepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoMapper.entityToCreateDepositScdlLogDto(entity);

            expect(result).toEqual({
                allocatorSiret: entity.allocatorSiret,
            });
        });
    });

    describe("entityToDepositScdlLogResponseDto", () => {
        let mockEntityUploadedFileInfosToDto;

        beforeEach(() => {
            mockEntityUploadedFileInfosToDto = jest
                .spyOn(DepositScdlLogDtoMapper, "entityUploadedFileInfosToDto")
                .mockReturnValue(UPLOADED_FILE_INFOS_ENTITY);
        });

        afterAll(() => {
            mockEntityUploadedFileInfosToDto.mockRestore();
        });

        it.each`
            entity
            ${DEPOSIT_LOG_ENTITY}
            ${DEPOSIT_LOG_ENTITY_STEP_2}
        `("should convert DepositScdlLogEntity to DepositScdlLogResponseDto", ({ entity }) => {
            const result = DepositScdlLogDtoMapper.entityToDepositScdlLogResponseDto(entity);
            expect(result).toMatchSnapshot();
        });
    });

    describe("entityUploadedFileInfosToDto", () => {
        it("should convert UploadedFileInfosEntity to UploadedFileInfosDto", () => {
            const result = DepositScdlLogDtoMapper.entityUploadedFileInfosToDto(UPLOADED_FILE_INFOS_ENTITY);
            expect(result).toMatchSnapshot();
        });
    });

    describe("depositScdlLogDtoToEntity", () => {
        it("should convert DepositScdlLogDto to DepositScdlLogEntity", () => {
            const dto: DepositScdlLogDto = {
                allocatorSiret: "12345678901234",
                permissionAlert: true,
            };
            const userId = "user123";
            const step = 3;

            const result = DepositScdlLogDtoMapper.depositScdlLogDtoToEntity(dto, userId, step);

            expect(result).not.toBeNull();
            expect(result).toMatchObject({
                userId: userId,
                step: step,
                permissionAlert: dto.permissionAlert,
                allocatorSiret: dto.allocatorSiret,
            });
        });
    });

    describe("createDepositScdlLogDtoToEntity", () => {
        it("should convert CreateDepositScdlLogDto to DepositScdlLogEntity", () => {
            const dto: CreateDepositScdlLogDto = {
                allocatorSiret: "12345678901234",
            };
            const allocatorName = "fake name";
            const userId = "user123";
            const step = 1;

            const result = DepositScdlLogDtoMapper.createDepositScdlLogDtoToEntity(dto, allocatorName, userId, step);

            expect(result).toMatchObject({
                userId: userId,
                step: step,
                allocatorSiret: dto.allocatorSiret,
                allocatorName: allocatorName,
            });
        });

        describe("uploadedFileInfosDtoToEntity", () => {
            it("should convert UploadedFileInfosDto to UploadedFileInfosEntity", () => {
                const dto: UploadedFileInfosDto = {
                    fileName: "test.xsl",
                    uploadDate: new Date(),
                    allocatorsSiret: ["12345678901234"],
                    grantCoverageYears: [2020, 2021],
                    parseableLines: 200,
                    totalLines: 202,
                    lineCountsByExercice: [],
                    missingHeaders: { optional: [], mandatory: [] },
                    existingLinesInDbOnSamePeriod: 0,
                    errorStats: { count: 0, errorSample: [] },
                };

                const result = DepositScdlLogDtoMapper.uploadedFileInfosDtoToEntity(dto);

                expect(result).toMatchObject({
                    fileName: dto.fileName,
                    uploadDate: dto.uploadDate,
                    allocatorsSiret: dto.allocatorsSiret,
                    grantCoverageYears: dto.grantCoverageYears,
                    parseableLines: dto.parseableLines,
                    totalLines: dto.totalLines,
                    existingLinesInDbOnSamePeriod: dto.existingLinesInDbOnSamePeriod,
                    errorStats: dto.errorStats,
                });
            });
        });

        describe("scdlErrorStatsDtoToEntity", () => {
            it("should convert scdlErrorStatsDto to scdlErrorStats", () => {
                const mixedError: MixedParsedErrorDto = {
                    colonne: "colonne",
                    valeur: "valeur",
                    message: "message",
                    bloquant: "oui",
                    doublon: "non",
                    otherProp: "une string",
                    otherProp2: 2,
                    otherProp3: true,
                };

                const dto = { count: 1, errorSample: [mixedError] };

                const result = DepositScdlLogDtoMapper.scdlErrorStatsDtoToEntity(dto);

                expect(result).toEqual({
                    count: dto.count,
                    errorSample: [
                        {
                            colonne: mixedError.colonne,
                            valeur: mixedError.valeur,
                            message: mixedError.message,
                            bloquant: mixedError.bloquant,
                            doublon: mixedError.doublon,
                            otherProp: mixedError.otherProp,
                            otherProp2: mixedError.otherProp2,
                            otherProp3: mixedError.otherProp3,
                        },
                    ],
                });
            });
        });

        describe("mixedParsedErrorDtoToEntity", () => {
            it("should convert MixedParsedErrorDto to MixedParsedError", () => {
                const dto: MixedParsedErrorDto = {
                    colonne: "colonne",
                    valeur: "valeur",
                    message: "message",
                    bloquant: "oui",
                    doublon: "non",
                    otherProp: "une string",
                    otherProp2: 2,
                    otherProp3: true,
                };

                const result = DepositScdlLogDtoMapper.mixedParsedErrorDtoToEntity(dto);

                expect(result).toEqual({
                    colonne: dto.colonne,
                    valeur: dto.valeur,
                    message: dto.message,
                    bloquant: dto.bloquant,
                    doublon: dto.doublon,
                    otherProp: dto.otherProp,
                    otherProp2: dto.otherProp2,
                    otherProp3: dto.otherProp3,
                });
            });
        });
    });
});
