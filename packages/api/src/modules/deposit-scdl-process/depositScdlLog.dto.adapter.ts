import DepositScdlLogEntity from "./entities/depositScdlLog.entity";
import {
    CreateDepositScdlLogDto,
    DepositScdlLogDto,
    DepositScdlLogResponseDto,
    MixedParsedErrorDto,
    UploadedFileInfosDto,
} from "dto";
import UploadedFileInfosEntity from "./entities/uploadedFileInfos.entity";
import { MixedParsedError } from "../providers/scdl/@types/Validation";

export default class DepositScdlLogDtoAdapter {
    static entityToDepositScdlLogDto(entity: DepositScdlLogEntity): DepositScdlLogDto {
        return {
            overwriteAlert: entity.overwriteAlert,
            allocatorSiret: entity.allocatorSiret,
            permissionAlert: entity.permissionAlert,
        };
    }

    static entityToCreateDepositScdlLogDto(entity: DepositScdlLogEntity): CreateDepositScdlLogDto {
        return {
            overwriteAlert: entity.overwriteAlert,
            allocatorSiret: entity.allocatorSiret,
        };
    }

    static entityToDepositScdlLogResponseDto(entity: DepositScdlLogEntity): DepositScdlLogResponseDto {
        return {
            overwriteAlert: entity.overwriteAlert,
            allocatorSiret: entity.allocatorSiret,
            permissionAlert: entity.permissionAlert,
            step: entity.step,
            uploadedFileInfos: entity.uploadedFileInfos
                ? this.entityUploadedFileInfosToDto(entity.uploadedFileInfos)
                : undefined,
        };
    }

    static entityUploadedFileInfosToDto(entity: UploadedFileInfosEntity): UploadedFileInfosDto {
        return {
            fileName: entity.fileName,
            uploadDate: entity.uploadDate,
            allocatorsSiret: entity.allocatorsSiret,
            grantCoverageYears: entity.grantCoverageYears,
            parseableLines: entity.parseableLines,
            totalLines: entity.totalLines,
            existingLinesInDbOnSamePeriod: entity.existingLinesInDbOnSamePeriod,
            errors: entity.errors,
            sheetName: entity.sheetName,
        };
    }

    static depositScdlLogDtoToEntity(dto: DepositScdlLogDto, userId: string, step: number): DepositScdlLogEntity {
        return new DepositScdlLogEntity(
            userId,
            step,
            undefined,
            dto.overwriteAlert,
            dto.allocatorSiret,
            dto.permissionAlert,
        );
    }

    static createDepositScdlLogDtoToEntity(
        dto: CreateDepositScdlLogDto,
        userId: string,
        step: number,
    ): DepositScdlLogEntity {
        return new DepositScdlLogEntity(userId, step, undefined, dto.overwriteAlert, dto.allocatorSiret);
    }

    static uploadedFileInfosDtoToEntity(dto: UploadedFileInfosDto): UploadedFileInfosEntity {
        return {
            fileName: dto.fileName,
            uploadDate: dto.uploadDate,
            allocatorsSiret: dto.allocatorsSiret,
            grantCoverageYears: dto.grantCoverageYears,
            parseableLines: dto.parseableLines,
            totalLines: dto.totalLines,
            existingLinesInDbOnSamePeriod: dto.existingLinesInDbOnSamePeriod,
            errors: dto.errors?.map(error => this.mixedParsedErrorDtoToEntity(error)),
            sheetName: dto.sheetName,
        };
    }

    static mixedParsedErrorDtoToEntity(dto: MixedParsedErrorDto): MixedParsedError {
        const { valeur, colonne, message, doublon, bloquant, ...otherProps } = dto;
        return {
            valeur,
            colonne,
            message,
            doublon,
            bloquant,
            ...otherProps,
        };
    }
}
