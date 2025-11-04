import {
    DEPOSIT_LOG_ENTITY,
    DEPOSIT_LOG_ENTITY_STEP_2,
    UPLOADED_FILE_INFOS_ENTITY,
} from "./__fixtures__/depositLog.fixture";
import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import DepositScdlLogDtoAdapter from "./depositScdlLog.dto.adapter";
import { CreateDepositScdlLogDto, DepositScdlLogDto, MixedParsedErrorDto } from "dto";

describe("depositScdlLogDtoAdapter", () => {
    describe("entityToDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoAdapter.entityToDepositScdlLogDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                allocatorSiret: entity.allocatorSiret,
                permissionAlert: entity.permissionAlert,
            });
        });
    });

    describe("entityToCreateDepositScdlLogDto", () => {
        it("should convert DepositScdlLogEntity to CreateDepositScdlLogDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoAdapter.entityToCreateDepositScdlLogDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                allocatorSiret: entity.allocatorSiret,
            });
        });
    });

    describe("entityToDepositScdlLogResponseDto", () => {
        it("should convert DepositScdlLogEntity to DepositScdlLogResponseDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY;
            const result = DepositScdlLogDtoAdapter.entityToDepositScdlLogResponseDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                allocatorSiret: entity.allocatorSiret,
                permissionAlert: entity.permissionAlert,
                step: entity.step,
            });
        });

        it("should convert DepositScdlLogEntity with uploadedFileInfos to DepositScdlLogResponseDto", () => {
            const entity: DepositScdlLogEntity = DEPOSIT_LOG_ENTITY_STEP_2;
            const result = DepositScdlLogDtoAdapter.entityToDepositScdlLogResponseDto(entity);

            expect(result).toEqual({
                overwriteAlert: entity.overwriteAlert,
                allocatorSiret: entity.allocatorSiret,
                permissionAlert: entity.permissionAlert,
                step: entity.step,
                uploadedFileInfos: entity.uploadedFileInfos,
            });
        });
    });

    describe("entityUploadedFileInfosToDto", () => {
        it("should convert UploadedFileInfosEntity to UploadedFileInfosDto", () => {
            const entity = UPLOADED_FILE_INFOS_ENTITY;
            const result = DepositScdlLogDtoAdapter.entityUploadedFileInfosToDto(entity);

            expect(result).toEqual({
                fileName: entity.fileName,
                uploadDate: entity.uploadDate,
                allocatorsSiret: entity.allocatorsSiret,
                errors: entity.errors,
                beginPaymentDate: entity.beginPaymentDate,
                endPaymentDate: entity.endPaymentDate,
                parseableLines: entity.parseableLines,
                existingLinesInDbOnSamePeriod: entity.existingLinesInDbOnSamePeriod,
            });
        });
    });

    describe("depositScdlLogDtoToEntity", () => {
        it("should convert DepositScdlLogDto to DepositScdlLogEntity", () => {
            const dto: DepositScdlLogDto = {
                overwriteAlert: true,
                allocatorSiret: "12345678901234",
                permissionAlert: true,
            };
            const userId = "user123";
            const step = 3;

            const result = DepositScdlLogDtoAdapter.depositScdlLogDtoToEntity(dto, userId, step);

            expect(result).not.toBeNull();
            expect(result).toMatchObject({
                userId: userId,
                step: step,
                overwriteAlert: dto.overwriteAlert,
                permissionAlert: dto.permissionAlert,
                allocatorSiret: dto.allocatorSiret,
            });
        });
    });

    describe("createDepositScdlLogDtoToEntity", () => {
        it("should convert CreateDepositScdlLogDto to DepositScdlLogEntity", () => {
            const dto: CreateDepositScdlLogDto = {
                overwriteAlert: true,
            };
            const userId = "user123";
            const step = 1;

            const result = DepositScdlLogDtoAdapter.createDepositScdlLogDtoToEntity(dto, userId, step);

            expect(result).toMatchObject({
                userId: userId,
                step: step,
                overwriteAlert: dto.overwriteAlert,
            });
        });

        describe("uploadedFileInfosDtoToEntity", () => {
            it("should convert UploadedFileInfosDto to UploadedFileInfosEntity", () => {
                const dto = {
                    fileName: "test.xsl",
                    uploadDate: new Date(),
                    allocatorsSiret: ["12345678901234"],
                    errors: [],
                    beginPaymentDate: undefined,
                    endPaymentDate: undefined,
                    parseableLines: undefined,
                    existingLinesInDbOnSamePeriod: undefined,
                };

                const result = DepositScdlLogDtoAdapter.uploadedFileInfosDtoToEntity(dto);

                expect(result).toMatchObject({
                    fileName: dto.fileName,
                    uploadDate: dto.uploadDate,
                    allocatorsSiret: dto.allocatorsSiret,
                    errors: dto.errors,
                    beginPaymentDate: dto.beginPaymentDate,
                    endPaymentDate: dto.endPaymentDate,
                    parseableLines: dto.parseableLines,
                    existingLinesInDbOnSamePeriod: dto.existingLinesInDbOnSamePeriod,
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

                const result = DepositScdlLogDtoAdapter.mixedParsedErrorDtoToEntity(dto);

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
